import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  dialogAction: {
    margin: theme.spacing(2),
  },
  dialogContent: {
    overflow: 'unset',
    display: 'flex',
    flexDirection: 'column',
  },
}));

function GridDetail({
  open,
  handleClose,
  product,
  keys,
}) {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Detail Product
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        {
          keys.map(keyItem => (
            <label key={keyItem}>{`${keyItem} : ${product[keyItem]}`}</label>
          ))
        }
      </DialogContent>

      <DialogActions className={classes.dialogAction}>
        <button
          className="mg-button primary"
          onClick={handleClose}
        >
          Close
        </button>
      </DialogActions>
    </Dialog>
  );
}

GridDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  product: PropTypes.object.isRequired,
  keys: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default GridDetail;
