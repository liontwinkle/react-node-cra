import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setRootCategory } from 'redux/actions/preview';
import CategoryItem from '../CategoryItem';

import './style.scss';

class CategoryView extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <div className="category-view_container">
        <CategoryItem />
        <CategoryItem />
        <CategoryItem />
        <CategoryItem />
        <CategoryItem />
        <CategoryItem />
        <CategoryItem />
        <CategoryItem />
        <CategoryItem />
      </div>
    );
  }
}

CategoryView.propTypes = {
  // rootCategories: PropTypes.array.isRequired,
  // setRootCategory: PropTypes.func.isRequired,
};
const mapStateToProps = (store) => ({
  rootCategories: store.previewData.rootCategories,
  categories: store.categoriesData.categories,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
  setRootCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoryView);
