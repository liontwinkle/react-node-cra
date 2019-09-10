import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withSnackbar } from 'notistack';
import { HotTable } from '@handsontable/react';

import { fetchProducts } from 'redux/actions/products';
import Loader from 'components/Loader';

import './style.scss';

class ProductTable extends Component {
  state = {
    fetchingFlag: true,
  };

  componentDidMount() {
    if (this.props.products.length === 0) {
      this.setState({
        fetchingFlag: true,
      });

      this.props.fetchProducts()
        .then(() => {
          this.setState({
            fetchingFlag: false,
          });
          this.props.enqueueSnackbar('Success fetching products data.', {
            variant: 'success',
            autoHideDuration: 1000,
          });
        })
        .catch(() => {
          this.props.enqueueSnackbar('Error in fetching products data.', {
            variant: 'error',
            autoHideDuration: 4000,
          });
        });
    } else {
      this.setState({
        fetchingFlag: false,
      });
    }
  }

  render() {
    const {
      columns,
      headers,
      products,
      tableRef,
    } = this.props;

    return (
      <div id="hot-app">
        {(!this.state.fetchingFlag)
          ? (
            <PerfectScrollbar>
              <HotTable
                ref={tableRef}
                root="hot"
                licenseKey="non-commercial-and-evaluation"
                settings={{
                  data: products,
                  columns,
                  width: '100%',
                  height: '100%',
                  headerTooltips: true,
                  colHeaders: headers,
                  rowHeaders: true,
                  contextMenu: true,
                  dropdownMenu: true,
                  hiddenColumns: true,
                }}
              />
            </PerfectScrollbar>
          ) : (
            <div className="loader">
              <Loader size="small" color="dark" />
            </div>
          )
        }
      </div>
    );
  }
}

ProductTable.propTypes = {
  tableRef: PropTypes.object.isRequired,
  columns: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  products: store.productsData.data.products,
  columns: store.productsData.data.columns,
  headers: store.productsData.data.headers,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductTable));
