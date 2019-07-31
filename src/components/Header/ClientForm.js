import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';

import { createClient, updateClient } from 'redux/actions/clients';
import { CustomInput } from 'components/elements';

const useStyles = makeStyles(theme => ({
  dialogAction: {
    margin: theme.spacing(2),
  },
}));

function ClientForm(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const {
    status,
    isSaving,
    client,
    createClient,
    updateClient,
    handleClose,
  } = props;

  const isAdd = status.type === 'Add';
  const [clientData, setClientData] = useState({
    name: isAdd ? '' : client.name,
    code: isAdd ? '' : client.code,
    url: isAdd ? '' : client.url,
  });
  const handleChange = field => (e) => {
    const newClient = {
      ...clientData,
      [field]: e.target.value,
    };
    setClientData(newClient);
  };

  const disabled = !(clientData.name && clientData.code && clientData.url);
  const handleSubmit = () => {
    if (!isSaving && !disabled) {
      const action = isAdd ? createClient : updateClient;

      action(clientData)
        .then(() => {
          enqueueSnackbar(`The client has been ${isAdd ? 'created' : 'updated'} successfully.`, { variant: 'success' });
          handleClose();
        })
        .catch(() => {
          enqueueSnackbar(`Error in ${status.type.toLowerCase()}ing client.`, { variant: 'error' });
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
};

ClientForm.defaultProps = {
  client: null,
};

const mapStateToProps = store => ({
  isSaving: store.clientsData.isCreating || store.clientsData.isUpdating,
  client: store.clientsData.client,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  createClient,
  updateClient,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientForm);
