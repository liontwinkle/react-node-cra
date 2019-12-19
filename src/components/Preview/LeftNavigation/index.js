import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getRootParent } from 'utils/propertyManagement';
import { getPreFilterData } from 'utils';

import _union from 'lodash/union';
import { fetchProducts } from 'redux/actions/products';
import Loader from 'components/Loader';
import CustomAccordion from './CustomAccordion';

import './style.scss';

class LeftNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      products: [],
      fetchingFlag: true,
    };
  }

  componentDidMount() {
    this.setState({ fetchingFlag: true });
    if (this.props.products.length === 0) {
      this.getProducts();
    } else {
      this.filterProducts(this.props.products);
      this.setState({ fetchingFlag: false });
    }
  }

  componentDidUpdate(prevProps) {
    const { products } = this.props;
    if (!this.state.fetchingFlag && products.length > 0 && prevProps.products !== products) {
      this.filterProducts(products);
    }
  }

  getProducts = () => {
    this.props.fetchProducts()
      .then(() => {
        if (this.props.products.length > 0) {
          this.filterProducts(this.props.products);
        } else {
          this.setState({ fetchingFlag: false });
        }
      })
      .catch(() => {
        this.setState({ fetchingFlag: false });
      });
  };

  filterProducts = (products) => {
    const { selectedCategory, categories } = this.props;
    const title = selectedCategory.name;
    const currentRules = selectedCategory.rules || [];
    const rootCategory = getRootParent(categories, selectedCategory, 'parent_id');
    const rootRules = rootCategory.rules || [];
    const universalRules = rootRules.filter((item) => (item.ruleType === 'universal'));
    const filterProducts = getPreFilterData(_union(currentRules, universalRules), products);
    this.updateState({
      title,
      products: filterProducts,
      fetchingFlag: false,
    });
  };

  updateState = (data) => {
    this.setState((prevState) => ({
      ...prevState,
      ...data,
    }));
  };

  render() {
    const { title, products, fetchingFlag } = this.state;
    return (
      <div className="left-navigation-container">
        {
          fetchingFlag ? (
            <Loader size="small" color="dark" />
          ) : (
            <div className="left-navigation-body">
              <div className="left-navigation-body__header">
                <h1>{title}</h1>
                <label>{`${products.length} items`}</label>
              </div>
              <div className="left-navigation-body__body">
                <CustomAccordion />
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

LeftNavigation.propTypes = {
  selectedCategory: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  fetchProducts: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  selectedCategory: store.previewData.selectedCategory,
  categories: store.categoriesData.categories,
  products: store.productsData.data.products,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeftNavigation);
