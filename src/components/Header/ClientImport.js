import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import { fileUpload, keyUpload } from 'redux/actions/upload';
import { fetchCategories } from 'redux/actions/categories';
import { fetchAttributes } from 'redux/actions/attribute';
import { fetchPropertyField } from 'redux/actions/propertyFields';
import { fetchProducts } from 'redux/actions/products';
import {
  confirmMessage, validateData, makeUploadData, asyncForEach, checkJSONData,
} from 'utils';
import Loader from '../Loader';
import UploadDlg from './UploadDlg';

import './style.scss';
import CustomMonaco from '../elements/CustomMonaco';

const useStyles = makeStyles(theme => ({
  dialogAction: { margin: theme.spacing(2) },
}));

function ClientImport({
  status,
  isUploading,
  isKeyUploading,
  client,
  type,
  handleClose,
  categories,
  attributes,
  fileUpload,
  fetchCategories,
  fetchAttributes,
  fetchProducts,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [importData, setImportData] = useState('');
  const [uploadFlag, setUploadFlag] = useState(false);
  const [fileSize, setFileSize] = useState(0);

  const uploading = async (data) => {
    await asyncForEach(data, async (subData, index) => {
      await fileUpload(subData);
      if (index === data.length - 1) {
        setImportData('');
        if (type.key === 'virtual' || type.key === 'native') {
          fetchCategories(client.id, type.key)
            .then(() => {
              fetchAttributes(client.id, 'attributes')
                .then(() => {
                  setUploadFlag(false);
                });
            });
        } else if (type.key === 'attributes') {
          fetchAttributes(client.id, type.key)
            .then(() => {
              setUploadFlag(false);
            });
        } else {
          fetchProducts()
            .then(() => {
              setUploadFlag(false);
            });
        }
        confirmMessage(enqueueSnackbar, 'Uploading is success.', 'success');
      }
    });
  };

  const saveData = (data) => {
    setUploadFlag(true);
    let readData = [];
    if (Array.isArray(data)) {
      readData = data;
    } else {
      readData.push(data);
    }
    const sendingData = validateData(type.key, readData, categories, attributes);
    const uploadData = makeUploadData(fileSize, sendingData);
    if (readData.length > 0 && sendingData.length > 0) {
      uploading(uploadData);
    } else {
      if (importData !== '') {
        confirmMessage(enqueueSnackbar,
          'Data is invalid. The Fields of Data are wrong or not exist', 'error');
      }
      setUploadFlag(false);
    }
  };
  const handleSubmit = () => {
    const data = checkJSONData(importData);
    if (data !== 'err') {
      saveData(data);
    } else {
      confirmMessage(enqueueSnackbar,
        'Data is invalid. The file is not JSON type or contain errors.', 'error');
    }
  };

  const onChangeHandle = type => (fileItem) => {
    if (fileItem.length > 0) {
      const { file } = fileItem[0];
      setFileSize(file.size);
      const { fileType } = fileItem[0];
      if (fileType === 'application/json') {
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          () => {
            if (type === 'data') {
              try {
                setImportData(reader.result);
              } catch (e) {
                confirmMessage(enqueueSnackbar,
                  'Data is invalid. The file is not correct.', 'error');
              }
            }
          },
          false,
        );
        reader.readAsText(file);
      }
    } else {
      setImportData('');
    }
  };

  const onEditHandle = (value) => {
    setImportData(value.toString());
  };

  return (
    <Dialog
      open={status.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {`Import Data to ${type.label} for ${client.name}`}
      </DialogTitle>

      <DialogContent>
        {
          !uploadFlag && !isKeyUploading ? (
            <Fragment>
              <UploadDlg
                onChangeData={onChangeHandle('data')}
                clientType={type.key}
              />
              <CustomMonaco
                label="Edit"
                // inline
                // value={JSON.stringify(importData, null, 2)}
                value={importData}
                key="upload"
                onChange={data => onEditHandle(data)}
              />
            </Fragment>
          ) : (
            <div className="upload_loader">
              <Loader size="small" color="dark" />
            </div>
          )
        }
      </DialogContent>

      <DialogActions className={classes.dialogAction}>
        <button
          className="mg-button secondary"
          disabled={isUploading}
          onClick={handleClose}
        >
          Cancel
        </button>
        {
          importData !== ''
          && (
            <button
              className="mg-button primary"
              disabled={isUploading}
              onClick={handleSubmit}
            >
            Save
            </button>
          )
        }
      </DialogActions>
    </Dialog>
  );
}

ClientImport.propTypes = {
  categories: PropTypes.array.isRequired,
  attributes: PropTypes.array.isRequired,
  status: PropTypes.object.isRequired,
  client: PropTypes.object,
  type: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  isKeyUploading: PropTypes.bool.isRequired,
  fileUpload: PropTypes.func.isRequired,
  fetchAttributes: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  fetchProducts: PropTypes.func.isRequired,
};

ClientImport.defaultProps = {
  client: null,
  type: null,
};

const mapStateToProps = store => ({
  categories: store.categoriesData.categories,
  attributes: store.attributesData.attributes,
  isUploading: store.uploadData.isUploading,
  isKeyUploading: store.uploadData.isKeyUploading,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fileUpload,
  keyUpload,
  fetchPropertyField,
  fetchCategories,
  fetchAttributes,
  fetchProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientImport);
