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

function SetLinkDlg({
  open,
  msg,
  confirmLabel,
  subCategoryNumber,
  handleSetLink,
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
          onClick={handleSetLink}
        >
          {confirmLabel}
        </button>
      </DialogActions>
    </Dialog>
  );
}

SetLinkDlg.propTypes = {
  open: PropTypes.bool.isRequired,
  msg: PropTypes.string.isRequired,
  confirmLabel: PropTypes.string,
  subCategoryNumber: PropTypes.number,
  handleSetLink: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

SetLinkDlg.defaultProps = {
  subCategoryNumber: 0,
  confirmLabel: 'delete',
};

export default SetLinkDlg;
