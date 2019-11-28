import React, { Component } from 'react';
import { connect } from 'react-redux';
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

const mapStateToProps = (store) => ({
  categories: store.categoriesData.categories,
});

export default connect(
  mapStateToProps,
)(CategoryView);
