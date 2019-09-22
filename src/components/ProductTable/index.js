import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withSnackbar } from 'notistack';
import { HotTable } from '@handsontable/react';
import _isEqual from 'lodash/isEqual';

import { fetchProducts, setUpdatedProducts } from 'redux/actions/products';
import Loader from 'components/Loader';
import { confirmMessage } from 'utils';

import './style.scss';

class ProductTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingFlag: true,
      hiddenColumns: [],
    };
  }

  componentDidMount() {
    if (this.props.products.length === 0) {
      this.setFetchFg(true);

      this.props.fetchProducts()
        .then(() => {
          this.setHiddenColumns(this.gethiddenColumns(this.props.productsField));
          confirmMessage(this.props.enqueueSnackbar, 'Success fetching products data.', 'success');
        })
        .catch(() => {
          confirmMessage(this.props.enqueueSnackbar, 'Error in fetching products data.', 'error');
        });
    } else {
      this.setHiddenColumns(this.gethiddenColumns(this.props.productsField));
    }
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.isUpdating !== this.props.isUpdating) && this.props.isUpdating) {
      console.log('## DEBUG START UPDATE FLAG #####'); // fixme
      this.setFetchFg(this.props.isUpdating);
    }

    if ((prevProps.isUpdatingList !== this.props.isUpdatingList) && this.props.isUpdatingList) {
      this.setFetchFg(this.props.isUpdatingList);
    }

    const diffFlag = _isEqual(prevProps.productsField, this.props.productsField);
    if (prevProps.columns.length > 0 && !diffFlag) {
      console.log('## DEBUG START UPDATE TABLE #####'); // fixme
      const time3 = performance.now();
      this.setFetchFg(true);
      this.setHiddenColumns(this.gethiddenColumns(this.props.productsField));
      console.log('## DEBUG TIME UPDATE TABLE :', performance.now() - time3); // fixme
    }
  }

  setFetchFg = (value) => {
    this.setState({
      fetchingFlag: value,
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
    return hiddenData;
  };

  setHiddenColumns = (data) => {
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
                  contextMenu: [
                    'copy',
                    'cut',
                    'hidden_columns_hide',
                    'hidden_columns_show',
                    'make_read_only',
                  ],
                  filters: true,
                  dropdownMenu: ['filter_by_condition', 'filter_action_bar'],
                  manualColumnResize: true,
                  manualRowResize: true,
                  manualColumnMove: true,
                  manualRowMove: true,
                  // multiColumnSorting: true,
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
  isUpdating: PropTypes.bool.isRequired,
  isUpdatingList: PropTypes.bool.isRequired,
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
  isUpdating: store.productsFieldsData.isUpdating,
  isUpdatingList: store.productsData.isUpdatingList,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
  setUpdatedProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductTable));
