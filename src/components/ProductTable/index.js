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
  setIndex,
} from 'redux/actions/products';

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingFlag: true,
    };
  }

  componentDidMount() {
    this.setState({
      fetchingFlag: true,
    });
    this.props.fetchProducts(this.props.index)
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

  handlePageClick = (data) => {
    const { selected } = data;
    const index = Math.ceil(selected);
    this.props.setIndex(index);
    this.props.fetchProducts(index)
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
              <PerfectScrollbar>
                <Fragment>
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
                  {
                    (length > 0) && (
                      <ReactPaginate
                        previousLabel="previous"
                        nextLabel="next"
                        breakLabel="..."
                        breakClassName="break-me"
                        pageCount={parseInt(length, 10) / 50}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={this.handlePageClick}
                        containerClassName="pagination"
                        subContainerClassName="pages pagination"
                        activeClassName="active"
                      />
                    )
                  }
                </Fragment>
              </PerfectScrollbar>

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
  setIndex: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  columns: PropTypes.array.isRequired,
  headers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
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
  setIndex,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductTable));
