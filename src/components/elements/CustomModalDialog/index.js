import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import PerfectScrollbar from 'react-perfect-scrollbar';

import { Brand } from 'utils/constants';
import './style.scss';

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
      <div className="modal-title-bar">
        <span className="modal-title-bar__brand">{Brand}</span>
        <CloseIcon className="modal-title-bar__close" onClick={handleClose} />
      </div>
      <span className="modal-title">{title}</span>
    </DialogTitle>
    <PerfectScrollbar>

      <DialogContent
        className={className}
        style={{
          minHeight: '200px',
          minWidth: '400px',
        }}
      >
        {children}
      </DialogContent>
    </PerfectScrollbar>
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
