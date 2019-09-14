import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withSnackbar } from 'notistack';
import { HotTable } from '@handsontable/react';

import { fetchProducts, setUpdatedProducts } from 'redux/actions/products';
import Loader from 'components/Loader';

import './style.scss';
import { confirmMessage } from '../../utils';

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
          confirmMessage(this.props.enqueueSnackbar, 'Success fetching products data.', 'success');
        })
        .catch(() => {
          confirmMessage(this.props.enqueueSnackbar, 'Error in fetching products data.', 'error');
        });
    } else {
      this.setState({
        fetchingFlag: false,
      });
    }
  }

  setChangeItem = (changes) => {
    if (changes) {
      if (changes[1] === 'id') {
        const duplicate = this.props.products.filter(item => (item.id === changes[3]));
        if (duplicate.length === 0) {
          this.props.setUpdatedProducts(changes);
        }
      } else {
        this.props.setUpdatedProducts(changes);
      }
    }
  };

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
                afterChange={this.setChangeItem}
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
  setUpdatedProducts: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  products: store.productsData.data.products,
  columns: store.productsData.data.columns,
  headers: store.productsData.data.headers,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
  setUpdatedProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductTable));
