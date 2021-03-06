import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import $ from 'jquery';
import { withSnackbar } from 'notistack';
import { HotTable } from '@handsontable/react';
import _isEqual from 'lodash/isEqual';

import { fetchProducts, setUpdatedProducts, setProducts } from 'redux/actions/products';
import { confirmMessage } from 'utils';
import Loader from 'components/Loader';
import FilterEngine from './filterEngine';

import './style.scss';

class ProductTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingFlag: false,
      isUpdating: false,
      isUpdatingList: false,
      hiddenColumns: [],
      data: [],
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.isUpdating !== prevState.isUpdating) {
      return {
        fetchingFlag: nextProps.isUpdating,
        isUpdating: nextProps.isUpdating,
        data: nextProps.products.slice(0, 100),
      };
    }

    if (!_isEqual(nextProps.products.slice(0, 100), prevState.data.slice(0, 100))) {
      return {
        data: nextProps.products.slice(0, 100),
        fetchingFlag: false,
      };
    }

    if (nextProps.isUpdatingList !== prevState.isUpdatingList) {
      return {
        fetchingFlag: nextProps.isUpdatingList,
        isUpdatingList: nextProps.isUpdatingList,
        data: nextProps.products.slice(0, 100),
      };
    }
    return null;
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
    const diffFlag = _isEqual(prevProps.productsField, this.props.productsField);
    if (prevProps.columns.length > 0 && !diffFlag) {
      this.setFetchFg(true);
      this.setHiddenColumns(this.gethiddenColumns(this.props.productsField));
    }
  }

  setFetchFg = (value) => {
    this.setState({ fetchingFlag: value });
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
    this.setState({ hiddenColumns: data, fetchingFlag: false });
  };

  setChangeItem = (changes) => {
    if (!(changes && changes[0][2] !== changes[0][3])) {
      return;
    }
    if (changes[0][1] === 'id') {
      const duplicate = this.props.products.find((item) => (item.id === changes[0][3]));
      if (duplicate) { this.props.setUpdatedProducts(changes); }
    } else {
      this.props.setUpdatedProducts(changes);
    }
  };

  makeFilterResult = (changes) => {
    const condition = (changes.length > 0) ? changes[0].conditions[0].name : null;
    let updateData = [];
    if (condition) {
      const column = this.props.headers[changes[0].column];
      switch (condition) {
        case 'empty':
        case 'not_empty':
          updateData = FilterEngine[condition](this.props.originProducts, column);
          break;
        case 'neq':
        case 'eq':
        case 'begins_with':
        case 'ends_with':
        case 'contains':
        case 'not_contains':
          const matchText = $('.htUIInput input').val();
          updateData = FilterEngine[condition](this.props.originProducts, column, matchText);
          break;
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
          const value = parseInt(changes[0].conditions[0].args[0], 10);
          updateData = FilterEngine[condition](this.props.originProducts, column, value);
          break;
        case 'between':
        case 'not_between':
          const startVal = parseInt(changes[0].conditions[0].args[0], 10);
          const endVal = parseInt(changes[0].conditions[0].args[1], 10);
          updateData = FilterEngine[condition](this.props.originProducts, column, startVal, endVal);
          break;
        default:
          break;
      }
      setTimeout(() => {
        this.setFetchFg(true);
        this.props.setProducts(updateData);
        this.setFetchFg(false);
      }, 0);
    }
  };

  sortResult = (changes) => {
    const newData = JSON.parse(JSON.stringify(this.props.products));
    if (changes && changes.length > 0) {
      if (changes[0].sortOrder === 'asc') {
        newData.sort((a, b) => (
          (a[this.props.headers[changes[0].column]] > b[this.props.headers[changes[0].column]]) ? 1 : -1));
      } else {
        newData.sort((a, b) => (
          (a[this.props.headers[changes[0].column]] < b[this.props.headers[changes[0].column]]) ? 1 : -1));
      }
      this.props.setProducts(newData);
    }
  };

  computeWindow = () => {
    const rowCount = this.props.tableRef.current.hotInstance.countRows();
    const rowOffset = this.props.tableRef.current.hotInstance.rowOffset();
    const visibleRows = this.props.tableRef.current.hotInstance.countVisibleRows();
    const lastRow = rowOffset + visibleRows;
    const lastVisibleRow = rowOffset + visibleRows + (visibleRows / 2);
    const threshold = 10;

    if (lastVisibleRow > (rowCount - threshold)) {
      this.loadMoreData(rowCount, lastRow);
    }
  };

  loadMoreData = (viewCount, endIndex) => {
    this.setState((prevState) => ({
      data: [...prevState.data, ...this.props.products.slice(endIndex, viewCount)],
    }));
  };

  render() {
    const {
      columns,
      headers,
      tableRef,
    } = this.props;

    return (
      <div id="hot-app">
        {(!this.state.fetchingFlag)
          ? (
            <HotTable
              ref={tableRef}
              root="hot"
              licenseKey="non-commercial-and-evaluation"
              afterChange={this.setChangeItem}
              afterFilter={this.makeFilterResult}
              afterColumnSort={this.sortResult}
              settings={{
                afterScrollVertically: this.computeWindow,
                data: this.state.data,
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
                multiColumnSorting: true,
                hiddenColumns: {
                  columns: this.state.hiddenColumns,
                  indicators: true,
                },
              }}
            />
          ) : (
            <div className="table-loader">
              <Loader size="small" color="dark" />
            </div>
          )}
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
  originProducts: PropTypes.array.isRequired,
  productsField: PropTypes.object.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  setUpdatedProducts: PropTypes.func.isRequired,
  setProducts: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  products: store.productsData.data.products,
  originProducts: store.productsData.originProducts,
  columns: store.productsData.data.columns,
  isUpdatingList: store.productsData.isUpdatingList,
  headers: store.productsData.data.headers,
  productsField: store.productsFieldsData.productsField,
  isUpdating: store.productsFieldsData.isUpdating,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchProducts,
  setUpdatedProducts,
  setProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductTable));
