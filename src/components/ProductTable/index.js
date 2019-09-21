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
import { confirmMessage } from 'utils';

class ProductTable extends Component {
  state = {
    fetchingFlag: true,
    hiddenColumns: [],
  };

  componentDidMount() {
    if (this.props.products.length === 0) {
      this.setState({
        fetchingFlag: true,
      });

      this.props.fetchProducts()
        .then(() => {
          this.setHiddenColumns(this.gethiddenColumns(this.props.productsField));
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

  componentDidUpdate(prevProps) {
    if (prevProps.columns.length > 0
      && (prevProps.productsField !== this.props.productsField)) {
      console.log('# DEBUG Time ####:'); // fixme
      const time1 = performance.now();
      // this.setDisplayState(true);
      const plugin = this.props.tableRef.current.hotInstance.getPlugin('hiddenColumns');
      plugin.hideColumns(this.gethiddenColumns(this.props.productsField));
      console.log('# RUNNING Time ####:', performance.now() - time1); // fixme
    }
  }

  setDisplayState = (state) => {
    this.setState({
      fetchingFlag: state,
    });
  };

  gethiddenColumns = (fieldData) => {
    const hiddenData = [];
    this.props.headers.forEach((item, key) => {
      if ((fieldData[item] !== undefined)
      && (fieldData[item].data !== undefined && !fieldData[item].data)) {
        hiddenData.push(key);
      }
    });
    console.log(hiddenData); // fixme
    return hiddenData;
  };

  setHiddenColumns = (data) => {
    console.log('Here'); // fixme
    this.setState({
      hiddenColumns: data,
      fetchingFlag: false,
    });
  };

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
                  hiddenColumns: {
                    columns: this.state.hiddenColumns,
                    indicators: true,
                  },
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
  productsField: PropTypes.object.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  setUpdatedProducts: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  products: store.productsData.data.products,
  columns: store.productsData.data.columns,
  headers: store.productsData.data.headers,
  productsField: store.productsFieldsData.productsField,

});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
  setUpdatedProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductTable));
