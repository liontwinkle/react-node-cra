import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FilePond } from 'react-filepond';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import fileUpload from 'redux/actions/upload';
import { fetchCategories } from 'redux/actions/categories';
import { fetchAttributes } from 'redux/actions/attribute';
import { fetchPropertyField } from 'redux/actions/propertyFields';
import { fetchProducts } from 'redux/actions/products';
import { confirmMessage, validateData } from 'utils';
import Loader from '../Loader';

const useStyles = makeStyles(theme => ({
  dialogAction: { margin: theme.spacing(2) },
}));

function ClientImport({
  status,
  isUploading,
  client,
  type,
  handleClose,
  fileUpload,
  // fetchPropertyField,
  fetchCategories,
  fetchAttributes,
  fetchProducts,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [importData, setImportData] = useState();
  const [uploadFlag, setUploadFlag] = useState(false);

  const handleSubmit = () => {
    setUploadFlag(true);
    if (validateData(type.key, importData).length > 0) {
      fileUpload(importData)
        .then(() => {
          setImportData(null);
          if (type.key === 'virtual' || type.key === 'native') {
            fetchCategories(client.id, type.key);
          } else if (type.key === 'attribtues') {
            fetchAttributes(client.id, type.key);
          } else {
            fetchProducts();
          }
          setUploadFlag(false);
          handleClose();
          confirmMessage(enqueueSnackbar, 'Uploading is success.', 'success');
        })
        .catch(() => {
          setImportData(null);
          setUploadFlag(false);
          confirmMessage(enqueueSnackbar, 'Uploading is not success.', 'error');
        });
    } else {
      confirmMessage(enqueueSnackbar, 'Data is invalidate', 'error');
    }
  };

  const onChangeHandle = (fileItem) => {
    if (fileItem.length > 0) {
      const { file } = fileItem[0];
      const { fileType } = fileItem[0];
      if (fileType === 'application/json') {
        const reader = new FileReader();
        reader.addEventListener(
          'load',
          () => {
            setImportData(JSON.parse(reader.result));
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
          !uploadFlag ? (
            <FilePond onupdatefiles={fileItems => onChangeHandle(fileItems)} />
          ) : (
            <div
              className="upload_loader"
              style={
                {
                  width: 'fit-content',
                  height: 'fit-content',
                  position: 'relative',
                  left: '45%',
                }
              }
            >
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
  status: PropTypes.object.isRequired,
  client: PropTypes.object,
  type: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  isUploading: PropTypes.bool.isRequired,
  fileUpload: PropTypes.func.isRequired,
  fetchAttributes: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  // fetchPropertyField: PropTypes.func.isRequired,
};

ClientImport.defaultProps = {
  client: null,
  type: null,
};

const mapStateToProps = store => ({
  isUploading: store.uploadData.isUploading,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fileUpload,
  fetchPropertyField,
  fetchCategories,
  fetchAttributes,
  fetchProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientImport);
