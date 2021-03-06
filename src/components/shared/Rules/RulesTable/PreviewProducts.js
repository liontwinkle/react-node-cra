import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { HotTable } from '@handsontable/react';

import './style.scss';

const PreviewProducts = ({
  open,
  handleClose,
  filterProducts,
  headers,
  columns,
}) => (
  <Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="form-dialog-title"
  >
    <DialogTitle id="form-dialog-title">
      Preview Products
    </DialogTitle>

    <DialogContent className="mg-edit-rule-content">
      <div id="hot-app">
        <HotTable
          root="hot"
          licenseKey="non-commercial-and-evaluation"
          settings={{
            data: filterProducts,
            columns,
            colHeaders: headers,
            rowHeaders: true,
            multiColumnSorting: true,
          }}
        />
      </div>
    </DialogContent>
  </Dialog>
);

PreviewProducts.propTypes = {
  open: PropTypes.bool.isRequired,
  headers: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  filterProducts: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  columns: store.productsData.data.columns,
  headers: store.productsData.data.headers,
});

export default connect(
  mapStateToProps,
)(PreviewProducts);
