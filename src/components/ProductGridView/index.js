import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import LazyLoad from 'react-lazyload';
import { withSnackbar } from 'notistack';
import $ from 'jquery';
import { fetchProducts } from 'redux/actions/products';
import Loader from 'components/Loader';
import { confirmMessage } from 'utils';
import './style.scss';
import DetailView from './detail_view';

class ProductGridView extends Component {
  constructor() {
    super();
    this.state = {
      fetchingFlag: true,
      detail: {},
      viewDetailFlag: false,
      pointX: 0,
      pointY: 0,
    };
  }

  componentDidMount() {
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
  }

  displayDetail = (key) => {
    const { top, left } = $(`.grid-item-${key}`)
      .offset();
    this.setState({
      detail: this.props.products[key],
      viewDetailFlag: true,
      pointX: left + 100,
      pointY: top + 100,
    });
  };

  handleClose = () => {
    this.setState({
      viewDetailFlag: false,
    });
  };

  render() {
    const {
      products,
      filterProducts,
      headers,
    } = this.props;

    const {
      viewDetailFlag,
      fetchingFlag,
      detail,
      pointX,
      pointY,
    } = this.state;

    const data = (filterProducts.length > 0) ? filterProducts : products;
    return (
      <div className="grid-view-container">
        {(!fetchingFlag)
          ? (
            <PerfectScrollbar
              options={{
                suppressScrollX: true,
                minScrollbarLength: 50,
              }}
            >
              <div className="grid-view-content">
                <LazyLoad height={200}>
                  {
                    data.map((item, key) => (
                      <img
                        key={parseInt(key, 10)}
                        src={item.image}
                        alt="product"
                        className={`grid-item-${key}`}
                        onMouseEnter={() => this.displayDetail(key)}
                      />
                    ))
                  }
                </LazyLoad>
              </div>
            </PerfectScrollbar>
          ) : (
            <div className="loader">
              <Loader size="small" color="dark" />
            </div>
          )
        }
        {viewDetailFlag && (
          <DetailView
            pointX={pointX}
            headers={headers}
            detail={detail}
            pointY={pointY}
          />
        )}
      </div>
    );
  }
}

ProductGridView.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
  filterProducts: PropTypes.array,
  headers: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
};

ProductGridView.defaultProps = {
  filterProducts: [],
};

const mapStateToProps = store => ({
  products: store.productsData.products,
  headers: store.productsData.headers,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductGridView));
