import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';

import { tableIcons } from 'utils/constants';
import './style.scss';

function PreviewProducts(props) {
  const {
    open,
    handleClose,
    // products,
    filterProducts,
    headers,
  } = props;

  console.log(headers);// fixme
  console.log(filterProducts);// fixme
  const tableData = {
    columns: headers.map(item => ({
      title: item,
      field: item,
      cellStyle: {
        maxWidth: 500,
        width: 500,
      },
      headerStyle: {
        maxWidth: 500,
        width: 500,
      },
    })),
    data: filterProducts,
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Preview Products
      </DialogTitle>

      <DialogContent className="mg-edit-rule-content">
        <MaterialTable
          title=""
          icons={tableIcons}
          columns={tableData.columns}
          data={tableData.data}
          options={{
            actionsColumnIndex: -1,
            showTitle: false,
            search: false,
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

PreviewProducts.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  // products: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  filterProducts: PropTypes.array.isRequired,
};

const mapStateToProps = store => ({
  isUpdating: store.categoriesData.isUpdating,
  products: store.productsData.products,
  headers: store.productsData.headers,
});

export default connect(
  mapStateToProps,
)(PreviewProducts);
