import React, { useState } from 'react';
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
import { confirmMessage, validateData, makeUploadData } from 'utils';
import Loader from '../Loader';
import UploadDlg from './UploadDlg';

import './style.scss';

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

  const [importData, setImportData] = useState(null);
  const [uploadFlag, setUploadFlag] = useState(false);
  const [fileSize, setFileSize] = useState(0);

  const handleSubmit = () => {
    setUploadFlag(true);
    let readData = [];
    if (Array.isArray(importData)) {
      readData = importData;
    } else {
      readData.push(importData);
    }
    console.log('#### DEBUG UPLOAD DATA: ', importData); // fixme
    const sendingData = validateData(type.key, readData, categories, attributes);
    const uploadData = makeUploadData(fileSize, sendingData);
    console.log('#### DEBUG FINAL UPLOAD DATA: ', uploadData); // fixme
    if (readData.length > 0 && sendingData.length > 0 && !isUploading) {
      fileUpload(uploadData)
        .then(() => {
          setImportData([]);
          if (type.key === 'virtual' || type.key === 'native') {
            fetchCategories(client.id, type.key).then(() => {
              fetchAttributes(client.id, 'attributes')
                .then(() => {
                  setUploadFlag(false);
                });
            });
          } else if (type.key === 'attributes') {
            fetchAttributes(client.id, type.key).then(() => { setUploadFlag(false); });
          } else {
            fetchProducts().then(() => { setUploadFlag(false); });
          }
          confirmMessage(enqueueSnackbar, 'Uploading is success.', 'success');
        })
        .catch(() => {
          setImportData(null);
          setUploadFlag(false);
          confirmMessage(enqueueSnackbar, 'Uploading is not success.', 'error');
        });
    } else {
      if (importData) {
        confirmMessage(enqueueSnackbar, 'Data is invalidate.', 'error');
      }
      setImportData(null);
      setUploadFlag(false);
    }
  };

  const onChangeHandle = type => (fileItem) => {
    if (fileItem.length > 0) {
      const { file } = fileItem[0];
      console.log('##### DEBUG INPUT FILE: ', file); // fixme
      setFileSize(file.size);
      const { fileType } = fileItem[0];
      if (fileType === 'application/json') {
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          () => {
            if (type === 'data') {
              setImportData(JSON.parse(reader.result));
            }
          },
          false,
        );
        reader.readAsText(file);
      }
    }
  };

  const disabled = (importData === undefined);
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
            <UploadDlg
              onChangeData={onChangeHandle('data')}
              clientType={type.key}
            />
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
        <button
          className="mg-button primary"
          disabled={isUploading || disabled}
          onClick={handleSubmit}
        >
            Save
        </button>
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
