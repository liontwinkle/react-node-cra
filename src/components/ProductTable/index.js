import React, { Fragment } from 'react';
import { HotTable } from '@handsontable/react';

import 'handsontable/dist/handsontable.full.css';
import './style.scss';
import { withSnackbar } from 'notistack';

import Loader from 'components/Loader';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { bindActionCreators } from 'redux';
import ReactPaginate from 'react-paginate';
import {
  fetchProducts,
  getLength,
} from 'redux/actions/products';
import { pagination } from 'utils/constants';
import { CustomSelect } from '../elements';

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingFlag: true,
      limit: {
        label: '50 products',
        key: 50,
      },
      index: 0,
    };
  }

  componentDidMount() {
    this.setState({
      fetchingFlag: true,
    });
    this.props.fetchProducts(0, this.state.limit.key)
      .then(() => {
        this.props.getLength();
        this.setState({
          fetchingFlag: false,
        });
        this.props.enqueueSnackbar('Success fetching products data.',
          {
            variant: 'success',
            autoHideDuration: 1000,
          });
      })
      .catch(() => {
        this.props.enqueueSnackbar('Error in fetching products data.',
          {
            variant: 'error',
            autoHideDuration: 4000,
          });
      });
  }

  handleChangeType = (value) => {
    const { index, limit } = this.state;
    const newIndex = Math.ceil(index / (value.key / limit.key));
    this.setState({
      limit: value,
      index: newIndex,
    });
    this.getProducts(newIndex, value.key);
  };

  getProducts = (index, limit) => {
    this.props.fetchProducts(index, limit)
      .then(() => {
        this.props.enqueueSnackbar('Success fetching products data.',
          {
            variant: 'success',
            autoHideDuration: 1000,
          });
      })
      .catch(() => {
        this.props.enqueueSnackbar('Error in fetching products data.',
          {
            variant: 'error',
            autoHideDuration: 4000,
          });
      });
  }

  handlePageClick = (data) => {
    const { selected } = data;
    const index = Math.ceil(selected);
    const { limit } = this.state;
    this.setState({
      index,
    });
    this.getProducts(index, limit.key);
  };

  render() {
    const {
      columns,
      headers,
      products,
      length,
    } = this.props;

    return (
      <div id="hot-app">
        {
          (!this.state.fetchingFlag)
            ? (
              <Fragment>
                {
                  (length > 0) && (
                    <div className="fragPageInfo">
                      <ReactPaginate
                        previousLabel="previous"
                        nextLabel="next"
                        breakLabel="..."
                        forcePage={this.state.index}
                        breakClassName="break-me"
                        pageCount={parseInt(length, 10) / this.state.limit.key}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName="pagination"
                        subContainerClassName="pages pagination"
                        activeClassName="active"
                      />
                      <CustomSelect
                        className="mr-3"
                        placeholder="Select Type"
                        value={this.state.limit}
                        items={pagination}
                        onChange={this.handleChangeType}
                      />
                    </div>
                  )
                }
                <PerfectScrollbar>
                  <HotTable
                    data={products}
                    columns={columns}
                    height={800}
                    rowHeaders
                    autoWrapRow
                    manualRowResize
                    autoColumnResize
                    colHeaders={headers}
                  />
                </PerfectScrollbar>
              </Fragment>

            )
            : (
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
  fetchProducts: PropTypes.func.isRequired,
  getLength: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  length: PropTypes.number.isRequired,
};

const mapStateToProps = store => ({
  products: store.productsData.products,
  columns: store.productsData.columns,
  headers: store.productsData.headers,
  index: store.productsData.index,
  length: store.productsData.length,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
  getLength,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductTable));
