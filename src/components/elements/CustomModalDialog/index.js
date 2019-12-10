import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


const CustomModalDialog = ({
  open,
  title,
  className,
  handleClose,
  children,
}) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">
      {title}
    </DialogTitle>
    <DialogContent className={className}>
      {children}
    </DialogContent>
  </Dialog>
);

CustomModalDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string,
  className: PropTypes.string,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

CustomModalDialog.defaultProps = {
  title: '',
  className: '',
};

export default CustomModalDialog;
