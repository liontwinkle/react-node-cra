import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Tooltip } from 'react-tippy';

import { removeClient } from 'redux/actions/clients';
import { IconButton } from 'components/elements';

const useStyles = makeStyles(theme => ({
  dialogAction: {
    margin: theme.spacing(2),
    marginTop: 0,
  },
}));

function ClientRemove(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const {
    isDeleting,
    client,
    removeClient,
  } = props;

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(!open);
  };

  const handleRemove = () => {
    if (!isDeleting) {
      removeClient(client.id)
        .then(() => {
          enqueueSnackbar('The client has been deleted successfully.', { variant: 'success', autoHideDuration: 1000 });
          handleOpen();
        })
        .catch(() => {
          enqueueSnackbar('Error in deleting client.', { variant: 'error', autoHideDuration: 1000 });
        });
    }
  };

  return (
    <Fragment>
      <Tooltip
        title="Delete Client"
        position="bottom"
        arrow
      >
        <IconButton
          className="danger"
          onClick={handleOpen}
        >
          <DeleteIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Client</DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this client?
          </DialogContentText>
        </DialogContent>

        <DialogActions className={classes.dialogAction}>
          <button
            className="mg-button secondary"
            disabled={isDeleting}
            onClick={handleOpen}
          >
            Cancel
          </button>
          <button
            className="mg-button danger"
            disabled={isDeleting}
            onClick={handleRemove}
          >
            Remove
          </button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

ClientRemove.propTypes = {
  isDeleting: PropTypes.bool.isRequired,
  client: PropTypes.object,
  removeClient: PropTypes.func.isRequired,
};

ClientRemove.defaultProps = {
  client: null,
};

const mapStateToProps = store => ({
  isDeleting: store.clientsData.isDeleting,
  client: store.clientsData.client,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  removeClient,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientRemove);
