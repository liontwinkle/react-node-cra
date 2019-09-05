import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import ProductGridView from 'components/ProductGridView';

import './style.scss';

const PreviewGrid = ({
  open,
  handleClose,
  filterProducts,
}) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">
      Preview Products
    </DialogTitle>

    <DialogContent className="mg-edit-rule-content" style={{ width: '1330px', height: '600px', overflow: 'hidden' }}>
      <ProductGridView filterProducts={filterProducts} />
    </DialogContent>
  </Dialog>
);

PreviewGrid.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  filterProducts: PropTypes.array.isRequired,
};

export default PreviewGrid;
