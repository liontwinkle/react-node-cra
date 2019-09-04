import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import LazyLoad from 'react-lazyload';
import { withSnackbar } from 'notistack';

import { fetchProducts } from 'redux/actions/products';
import Loader from 'components/Loader';
import './style.scss';

class ProductGridView extends Component {
  constructor() {
    super();
    this.state = {
      fetchingFlag: true,
      detail: {},
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
  }

  displayDetail = (key) => {
    this.setState({
      detail: this.props.products[key],
    });
    console.log(this.state.detail);// fixme
  };

  render() {
    const {
      products,
    } = this.props;

    return (
      <div className="grid-view-container">
        {(!this.state.fetchingFlag)
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
                    products.map((item, key) => (
                      <img
                        key={parseInt(key, 10)}
                        src={item.image}
                        alt="product"
                        className="grid-item"
                        onClick={() => this.displayDetail(key)}
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
      </div>
    );
  }
}

ProductGridView.propTypes = {
  products: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  products: store.productsData.products,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductGridView));
