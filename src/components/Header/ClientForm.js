import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useSnackbar } from 'notistack';
import { DialogActions, makeStyles } from '@material-ui/core';

import {
  createClient, updateClient, fetchClients, setClient,
} from 'redux/actions/clients';
import { createPropertyField, updatePropertyField } from 'redux/actions/propertyFields';
import { CustomInput } from 'components/elements';
import { confirmMessage } from 'utils';
import CustomModalDialog from '../elements/CustomModalDialog';

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

  useEffect(() => {
    if (client === null && !status.Add) {
      handleClose();
    }
  }, [client, handleClose, status.Add]);
  const isAdd = (status.Add === true) ? 'Add' : 'Edit';
  const [clientData, setClientData] = useState({
    _id: isAdd === 'Add' ? '' : ((client && client._id) || ''),
    name: isAdd === 'Add' ? '' : ((client && client.name) || ''),
    code: isAdd === 'Add' ? '' : ((client && client.code) || ''),
    url: isAdd === 'Add' ? '' : ((client && client.url) || ''),
    nameErr: false,
    codeErr: false,
    urlErr: false,
  });

  const checkValidate = (value, type, field) => {
    const originValue = client ? client[field] : '';
    const index = (type === 'isAdd')
      ? clients.findIndex((clientItem) => (clientItem[field] === value))
      : clients.findIndex((clientItem) => (clientItem[field] === value && clientItem[field] !== originValue));
    return (index >= 0);
  };
  const handleChange = (field) => (e) => {
    const { value } = e.target;
    let newClient = {
      ...clientData,
      [field]: value,
    };
    if (isAdd === 'Add' || isAdd === 'Edit') {
      if (field === 'name') {
        newClient = {
          ...newClient,
          nameErr: checkValidate(value, isAdd, 'name'),
        };
      } else if (field === 'url') {
        newClient = {
          ...newClient,
          urlErr: checkValidate(value, isAdd, 'url'),
        };
      } else if (field === 'code') {
        newClient = {
          ...newClient,
          _id: newClient.code,
          codeErr: checkValidate(value, isAdd, 'code'),
        };
      }
    }
    setClientData(newClient);
  };

  const checkClientDuplicate = (clientData) => {
    if (isAdd === 'Add') {
      return !checkValidate(clientData.name, isAdd, 'name')
      && !checkValidate(clientData.code, isAdd, 'code')
      && !checkValidate(clientData.url, isAdd, 'url');
    }
    return true;
  };

  const disabled = !(clientData.name && clientData.code && clientData.url)
    || clientData.nameErr || clientData.urlErr || clientData.codeErr;

  const handleSubmit = () => {
    if (!isSaving && !disabled && checkClientDuplicate(clientData)) {
      const actionClient = (isAdd === 'Add') ? createClient : updateClient;
      const actionPropertyField = (isAdd === 'Add') ? createPropertyField : updatePropertyField;
      const sendData = JSON.parse(JSON.stringify(clientData));
      actionClient(sendData)
        .then(() => {
          actionPropertyField({ clientId: sendData.code })
            .then(() => {
              confirmMessage(enqueueSnackbar,
                `The client has been ${isAdd ? 'created' : 'updated'} successfully.`, 'success');
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
    <CustomModalDialog
      title={`${isAdd} Client`}
      handleClose={handleClose}
      open={status.Add || status.Edit}
    >
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
    </CustomModalDialog>
  );
}

ClientForm.propTypes = {
  status: PropTypes.object.isRequired,
  client: PropTypes.object,
  clients: PropTypes.array.isRequired,
  isSaving: PropTypes.bool.isRequired,
  createClient: PropTypes.func.isRequired,
  updateClient: PropTypes.func.isRequired,
  // fetchClients: PropTypes.func.isRequired,
  // setClient: PropTypes.func.isRequired,
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
  fetchClients,
  setClient,
  createPropertyField,
  updatePropertyField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientForm);
