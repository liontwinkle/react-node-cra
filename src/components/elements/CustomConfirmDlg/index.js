import React from 'react';
import PropTypes from 'prop-types';
import { DialogActions, makeStyles } from '@material-ui/core';
import CustomModalDialog from '../CustomModalDialog';

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
    <CustomModalDialog
      handleClose={handleClose}
      open={open}
      title={msg}
    >
      <span>
        {(subCategoryNumber > 0) && `This will also delete ${subCategoryNumber} subcategories.`}
      </span>

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
    </CustomModalDialog>
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
