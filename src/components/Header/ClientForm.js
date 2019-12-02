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
  clients,
  createClient,
  updateClient,
  createPropertyField,
  updatePropertyField,
  handleClose,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const isAdd = (status.Add === true) ? 'Add' : 'Edit';
  const [clientData, setClientData] = useState({
    name: isAdd === 'Add' ? '' : client.name,
    code: isAdd === 'Add' ? '' : client.code,
    url: isAdd === 'Add' ? '' : client.url,
    nameErr: false,
    codeErr: false,
    urlErr: false,
  });

  const checkClientName = (value) => {
    const index = clients.findIndex((clientItem) => (clientItem.name === value));
    return (index >= 0);
  };

  const checkClientCode = (value) => {
    const index = clients.findIndex((clientItem) => (clientItem.code === value));
    return (index >= 0);
  };

  const checkClientUrl = (value) => {
    const index = clients.findIndex((clientItem) => (clientItem.url === value));
    return (index >= 0);
  };

  const handleChange = (field) => (e) => {
    const { value } = e.target;
    let newClient = {
      ...clientData,
      [field]: value,
    };
    if (isAdd === 'Add') {
      if (field === 'name') {
        newClient = {
          ...newClient,
          nameErr: checkClientName(value),
        };
      } else if (field === 'url') {
        newClient = {
          ...newClient,
          urlErr: checkClientUrl(value),
        };
      } else if (field === 'code') {
        newClient = {
          ...newClient,
          codeErr: checkClientCode(value),
        };
      }
    }
    setClientData(newClient);
  };

  const checkClientDuplicate = (clientData) => {
    if (isAdd === 'Add') {
      return !checkClientName(clientData.name)
      && !checkClientCode(clientData.code)
      && !checkClientUrl(clientData.url);
    }
    return true;
  };

  const disabled = !(clientData.name && clientData.code && clientData.url)
    || clientData.nameErr || clientData.urlErr || clientData.codeErr;

  const handleSubmit = () => {
    if (!isSaving && !disabled && checkClientDuplicate(clientData)) {
      const actionClient = (isAdd === 'Add') ? createClient : updateClient;
      const actionPropertyField = (isAdd === 'Add') ? createPropertyField : updatePropertyField;

      actionClient(clientData)
        .then(() => {
          actionPropertyField(clientData)
            .then(() => {
              confirmMessage(enqueueSnackbar,
                `The client has been ${(isAdd === 'Add') ? 'created' : 'updated'} successfully.`, 'success');
              handleClose();
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, `Error in ${isAdd.toLowerCase()}ing client.`, 'error');
            });
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, `Error in ${isAdd.toLowerCase()}ing client.`, 'error');
        });
    }
  };

  return (
    <Dialog
      open={status.Add || status.Edit}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {`${isAdd} Client`}
      </DialogTitle>

      <DialogContent>
        <CustomInput
          className="mb-3"
          label="Name"
          inline
          value={clientData.name}
          onChange={handleChange('name')}
          hint={clientData.nameErr ? 'Name* is duplicated.' : ''}
        />
        <CustomInput
          className="mb-3"
          label="Code"
          inline
          value={clientData.code}
          onChange={handleChange('code')}
          hint={clientData.codeErr ? 'Code* is duplicated.' : ''}
        />
        <CustomInput
          label="URL"
          inline
          value={clientData.url}
          onChange={handleChange('url')}
          hint={clientData.urlErr ? 'Url* is duplicated.' : ''}
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
  client: PropTypes.object,
  clients: PropTypes.array.isRequired,
  isSaving: PropTypes.bool.isRequired,
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
  clients: store.clientsData.clients,
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
