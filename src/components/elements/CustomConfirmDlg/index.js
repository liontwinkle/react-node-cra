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

function CustomConfirmDlg(props) {
  const classes = useStyles();
  const {
    open,
    subCategoryNumber,
    handleClose,
    msg,
  } = props;

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

CustomConfirmDlg.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  msg: PropTypes.string.isRequired,
  subCategoryNumber: PropTypes.number,
};

CustomConfirmDlg.defaultProps = {
  subCategoryNumber: 0,
};
export default CustomConfirmDlg;
