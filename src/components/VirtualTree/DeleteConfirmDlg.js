import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  dialogAction: {
    margin: theme.spacing(2),
  },
  dialogContent: {
    overflow: 'unset',
  },
}));

function DeleteConfirmDlg(props) {
  const classes = useStyles();
  const {
    open,
    subCategoryNumber,
    handleClose,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Are you sure you want to delete this category?
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <span>
          { (subCategoryNumber > 0) && `This will also delete ${subCategoryNumber} subcategories. `}
        </span>
      </DialogContent>

      <DialogActions className={classes.dialogAction}>
        <button
          className="mg-button secondary"
          onClick={() => handleClose('no')}
        >
          Cancel
        </button>
        <button
          className="mg-button primary"
          onClick={() => handleClose('yes')}
        >
          Delete
        </button>
      </DialogActions>
    </Dialog>
  );
}

DeleteConfirmDlg.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  subCategoryNumber: PropTypes.number.isRequired,
};

export default DeleteConfirmDlg;
