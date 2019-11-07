import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  dialogAction: {
    margin: theme.spacing(2),
  },
  dialogContent: {
    overflow: 'unset',
  },
}));

function CustomConfirmDlg({
  open,
  msg,
  confirmLabel,
  subCategoryNumber,
  handleDelete,
  handleClose,
}) {
  const classes = useStyles();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {msg}
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <span>
          {(subCategoryNumber > 0) && `This will also delete ${subCategoryNumber} subcategories.`}
        </span>
      </DialogContent>

      <DialogActions className={classes.dialogAction}>
        <button
          className="mg-button secondary"
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          className="mg-button primary"
          onClick={handleDelete}
        >
          {confirmLabel}
        </button>
      </DialogActions>
    </Dialog>
  );
}

CustomConfirmDlg.propTypes = {
  open: PropTypes.bool.isRequired,
  msg: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  subCategoryNumber: PropTypes.number,
  handleDelete: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

CustomConfirmDlg.defaultProps = {
  subCategoryNumber: 0,
  confirmLabel: 'delete',
};

export default CustomConfirmDlg;
