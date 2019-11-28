import React, { Component } from 'react';

import './style.scss';
import CategoryItem from '../CategoryItem';

class ProductBody extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <div className="product-body_container">
        <CategoryItem />
      </div>
    );
  }
}

export default ProductBody;
