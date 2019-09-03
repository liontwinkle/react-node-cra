import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
            autoWrapRow: true,
            manualRowResize: true,
            manualColumnResize: true,
            manualColumnMove: true,
            manualRowMove: true,
            autoColumnResize: true,
            headerTooltips: true,
            colHeaders: headers,
            rowHeaders: true,
            stretchH: 'all',
            contextMenu: true,
            exportFile: true,
            multiColumnSorting: {
              indicator: true,
            },
            dropdownMenu: true,
            filters: true,
            hiddenColumns: true,
          }}
        />
      </div>
    </DialogContent>
  </Dialog>
);

PreviewProducts.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  headers: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  filterProducts: PropTypes.array.isRequired,
};

const mapStateToProps = store => ({
  isUpdating: store.categoriesData.isUpdating,
  columns: store.productsData.columns,
  headers: store.productsData.headers,
});

export default connect(
  mapStateToProps,
)(PreviewProducts);
