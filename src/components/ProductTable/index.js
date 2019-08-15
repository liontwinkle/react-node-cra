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
import { fetchProducts, getLength } from 'redux/actions/products';

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingFlag: true,
    };
  }

  componentDidMount() {
    const {
      index,
      fetchProducts,
      getLength,
    } = this.props;
    this.setState({
      fetchingFlag: true,
    });
    fetchProducts(index)
      .then(() => {
        getLength();
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
    console.log('slected', selected);// fixme
    this.props.fetchProducts(index)
      .then(() => {
        this.setState({
          fetchingFlag: false,
        });
        this.props.enqueueSnackbar('Success fetching products data.',
          {
            variant: 'success',
            autoHideDuration: 1000,
          });
      })
      .catch((err) => {
        console.log(err);// fixme
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
      index,
      products,
      length,
    } = this.props;
    console.log('current Index>>>>', index);// fixme
    console.log('current length>>>>', length);// fixme
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
  isFetching: store.productsData.isFetching,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
  getLength,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductTable));
