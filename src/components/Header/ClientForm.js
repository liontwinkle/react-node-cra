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

import { createClient, updateClient } from 'redux/actions/clients';
import { createPropertyField, updatePropertyField } from 'redux/actions/propertyFields';
import { CustomInput } from 'components/elements';
import { confirmMessage } from 'utils';

const useStyles = makeStyles((theme) => ({
  dialogAction: { margin: theme.spacing(2) },
}));

function ClientForm({
  status,
  isSaving,
  client,
  createClient,
  updateClient,
  createPropertyField,
  updatePropertyField,
  handleClose,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const isAdd = status.type === 'Add';
  const [clientData, setClientData] = useState({
    name: isAdd ? '' : client.name,
    code: isAdd ? '' : client.code,
    url: isAdd ? '' : client.url,
  });
  const handleChange = (field) => (e) => {
    const newClient = {
      ...clientData,
      [field]: e.target.value,
    };
    setClientData(newClient);
  };

  const disabled = !(clientData.name && clientData.code && clientData.url);
  const handleSubmit = () => {
    if (!isSaving && !disabled) {
      const actionClient = isAdd ? createClient : updateClient;
      const actionPropertyField = isAdd ? createPropertyField : updatePropertyField;

      actionClient(clientData)
        .then(() => {
          actionPropertyField(clientData)
            .then(() => {
              confirmMessage(enqueueSnackbar,
                `The client has been ${isAdd ? 'created' : 'updated'} successfully.`, 'success');
              handleClose();
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, `Error in ${status.type.toLowerCase()}ing client.`, 'error');
            });
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, `Error in ${status.type.toLowerCase()}ing client.`, 'error');
        });
    }
  };

  return (
    <Dialog
      open={status.open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {`${status.type} Client`}
      </DialogTitle>

      <DialogContent>
        <CustomInput
          className="mb-3"
          label="Name"
          inline
          value={clientData.name}
          onChange={handleChange('name')}
        />
        <CustomInput
          className="mb-3"
          label="Code"
          inline
          value={clientData.code}
          onChange={handleChange('code')}
        />
        <CustomInput
          label="URL"
          inline
          value={clientData.url}
          onChange={handleChange('url')}
        />
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

ClientForm.propTypes = {
  status: PropTypes.object.isRequired,
  isSaving: PropTypes.bool.isRequired,
  client: PropTypes.object,
  createClient: PropTypes.func.isRequired,
  updateClient: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  createPropertyField: PropTypes.func.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
};

ClientForm.defaultProps = {
  client: null,
};

const mapStateToProps = (store) => ({
  isSaving: store.clientsData.isCreating || store.clientsData.isUpdating,
  client: store.clientsData.client,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createClient,
  updateClient,
  createPropertyField,
  updatePropertyField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientForm);
