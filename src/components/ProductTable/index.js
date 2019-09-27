import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
      fetchingFlag: true,
      hiddenColumns: [],
      products: [],
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
      this.setFetchFg(this.props.isUpdating);
    }

    if ((prevProps.isUpdatingList !== this.props.isUpdatingList) && this.props.isUpdatingList) {
      this.setFetchFg(this.props.isUpdatingList);
    }

    const diffFlag = _isEqual(prevProps.productsField, this.props.productsField);
    if (prevProps.columns.length > 0 && !diffFlag) {
      this.setFetchFg(true);
      this.setHiddenColumns(this.gethiddenColumns(this.props.productsField));
    }

    if (prevProps.products !== this.props.products) {
      this.setProducts(this.props.products);
      this.setFetchFg(false);
    }
  }

  setProducts = (products) => {
    this.setState({
      products,
    });
  };

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

  makeFilterResult = (changes) => {
    console.log('######### DEBUG START CUSTOM FILTER ##################'); // fixme
    console.log('#### DEBUG CHANGES :', changes); // fixme
    const condition = changes[0].conditions[0].name;
    console.log('#### DEBUG CONDITION :', condition);
    const column = this.props.headers[changes[0].column];
    console.log('#### DEBUG COLUMN :', column);
    const matchText = changes[0].conditions[0].args[0];
    console.log('#### DEBUG ARGS :', matchText);
    const updateData = FilterEngine[condition](this.props.products, column, matchText);
    this.props.setProducts(updateData);
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
            <PerfectScrollbar>
              <HotTable
                ref={tableRef}
                root="hot"
                licenseKey="non-commercial-and-evaluation"
                afterChange={this.setChangeItem}
                afterFilter={this.makeFilterResult}
                settings={{
                  data: this.state.products,
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
                  viewportRowRenderingOffset: 70,
                  viewportColumnRenderingOffset: 10,
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
            <div className="table-loader">
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
  setProducts: PropTypes.func.isRequired,
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
  setProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductTable));
