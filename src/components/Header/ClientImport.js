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

import { createClient, updateClient } from 'redux/actions/clients';
import { createPropertyField, updatePropertyField } from 'redux/actions/propertyFields';


const useStyles = makeStyles(theme => ({
  dialogAction: { margin: theme.spacing(2) },
}));

function ClientImport({
  status,
  isSaving,
  client,
  type,
  handleClose,
}) {
  const classes = useStyles();
  // const { enqueueSnackbar } = useSnackbar();

  const [importData] = useState();

  const handleSubmit = () => {
    console.log('#### DEBUG SUBMIT ####'); // fixme
  };

  const onChangeHandle = (fileItem) => {
    if (fileItem.length > 0) {
      const { file } = fileItem[0];
      console.log('####EVENT FILE: ', file);
      const { fileSize } = fileItem[0];
      console.log('####EVENT FILE SIZE: ', fileSize);
      const { fileType } = fileItem[0];
      console.log('####EVENT FILE SIZE: ', fileType);
    }
  };

  const disabled = (importData !== undefined);
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
        <FilePond onupdatefiles={fileItems => onChangeHandle(fileItems)} />
      </DialogContent>

      <DialogActions className={classes.dialogAction}>
        <button
          className="mg-button secondary"
          disabled={isSaving}
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          className="mg-button primary"
          disabled={isSaving || disabled}
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
  isSaving: PropTypes.bool.isRequired,
  client: PropTypes.object,
  type: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};

ClientImport.defaultProps = {
  client: null,
  type: null,
};

const mapStateToProps = store => ({
  isSaving: store.clientsData.isCreating || store.clientsData.isUpdating,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createClient,
  updateClient,
  createPropertyField,
  updatePropertyField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientImport);
