import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tooltip } from 'react-tippy';
import { useSnackbar } from 'notistack';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from 'components/elements';

import { removeClient } from 'redux/actions/clients';
import { removePropertyField } from 'redux/actions/propertyFields';
import { removeProductsField } from 'redux/actions/productsFields';
import { setProducts } from 'redux/actions/products';
import { updateNodeData } from 'redux/actions/attribute';
import { updateTreeData } from 'redux/actions/categories';
import { confirmMessage } from 'utils';

const useStyles = makeStyles((theme) => ({
  dialogAction: {
    margin: theme.spacing(2),
    marginTop: 0,
  },
}));

function ClientRemove({
  isDeleting,
  client,
  disabled,
  removeClient,
  removePropertyField,
  removeProductsField,
  updateTreeData,
  updateNodeData,
  setProducts,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    if (!disabled) {
      setOpen(!open);
    }
  };

  const handleRemove = () => {
    if (!isDeleting) {
      removePropertyField()
        .then(() => {
          removeProductsField()
            .then(() => {
              removeClient(client.id)
                .then(() => {
                  setProducts([]);
                  updateNodeData([]);
                  updateTreeData([]);
                  confirmMessage(enqueueSnackbar, 'The client has been deleted successfully.', 'success');
                })
                .catch(() => {
                  confirmMessage(enqueueSnackbar, 'Error in deleting client.', 'error');
                });
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, 'Error in deleting client.', 'error');
            });
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error in deleting client.', 'error');
        });
    }
  };

  return (
    <>
      <Tooltip
        title="Delete Client"
        position="bottom"
        arrow
      >
        <IconButton className="danger" onClick={handleOpen}>
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
    </>
  );
}

ClientRemove.propTypes = {
  isDeleting: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  client: PropTypes.object,
  removeClient: PropTypes.func.isRequired,
  removePropertyField: PropTypes.func.isRequired,
  removeProductsField: PropTypes.func.isRequired,
  updateTreeData: PropTypes.func.isRequired,
  updateNodeData: PropTypes.func.isRequired,
  setProducts: PropTypes.func.isRequired,
};

ClientRemove.defaultProps = {
  client: null,
  disabled: false,
};

const mapStateToProps = (store) => ({
  isDeleting: store.clientsData.isDeleting,
  client: store.clientsData.client,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  removeClient,
  removePropertyField,
  removeProductsField,
  setProducts,
  updateNodeData,
  updateTreeData,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientRemove);
