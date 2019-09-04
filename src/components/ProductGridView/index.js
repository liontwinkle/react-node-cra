import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withSnackbar } from 'notistack';

import { fetchProducts } from 'redux/actions/products';
import Loader from 'components/Loader';
import lozad from 'lozad';
import './style.scss';

class ProductGridView extends Component {
  observer = lozad();

  constructor() {
    super();
    this.state = {
      fetchingFlag: true,
    };
  }

  componentDidMount() {
    this.observer.observe();


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
                {
                  products.map((item, key) => (
                    <img
                      key={parseInt(key, 10)}
                      className="lozad"
                      // data-src={item.image}
                      src={item.image}
                      alt="product"
                    />
                  ))
                }
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
  // tableRef: PropTypes.object.isRequired,
  // columns: PropTypes.array.isRequired,
  // headers: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  products: store.productsData.products,
  // columns: store.productsData.columns,
  // headers: store.productsData.headers,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withSnackbar(ProductGridView));
