import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FilePond } from 'react-filepond';
import PropTypes from 'prop-types';
// import { useSnackbar } from 'notistack';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import fileUpload from 'redux/actions/upload';
import Loader from '../Loader';
// import { confirmMessage } from '../../utils';

const useStyles = makeStyles(theme => ({
  dialogAction: { margin: theme.spacing(2) },
}));

function ClientImport({
  status,
  isUploading,
  client,
  type,
  handleClose,
  // fileUpload,
}) {
  const classes = useStyles();
  // const { enqueueSnackbar } = useSnackbar();

  const [importData, setImportData] = useState();
  const [uploadFlag, setUploadFlag] = useState(false);

  const handleSubmit = () => {
    console.log('#### DEBUG SUBMIT ####'); // fixme
    console.log('#### DEBUG DATA: ', importData); // fixme
    setUploadFlag(true);
    // fileUpload(importData)
    //   .then(() => {
    //     setImportData(null);
    //     setUploadFlag(false);
    //     confirmMessage(enqueueSnackbar, 'Uploading is success.', 'success');
    //   })
    //   .catch(() => {
    //     setImportData(null);
    //     setUploadFlag(false);
    //     confirmMessage(enqueueSnackbar, 'Uploading is not success.', 'error');
    //   });
  };

  const onChangeHandle = (fileItem) => {
    if (fileItem.length > 0) {
      const { file } = fileItem[0];
      console.log('####EVENT FILE: ', file);
      const { fileSize } = fileItem[0];
      console.log('####EVENT FILE SIZE: ', fileSize);
      const { fileType } = fileItem[0];
      console.log('####EVENT FILE SIZE: ', fileType);
      if (fileType === 'application/json') {
        console.log('FILE DATA: ', file); // fixme
        setImportData(file);
      }
    }
  };

  const disabled = (importData === undefined);
  console.log('## DEBUG IS UPLOADING: ', isUploading); // fixme
  console.log('## DEBUG DISABLE: ', disabled); // fixme
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
  // fileUpload: PropTypes.func.isRequired,
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
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientImport);
