import React, { Component } from 'react';

import './style.scss';
import TopCategory from '../../components/Preview/TopCategory';
import LeftNavigation from '../../components/Preview/LeftNavigation';
import ProductBody from '../../components/Preview/ProductBody';

class Preview extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <div className="preview_container">
        <div className="preview_top">
          <TopCategory />
          <span className="preview_route">
            <ul>
              <li>{`${'Outwear >'}`}</li>
              <li>{`${'Men >'}`}</li>
              <li>{`${'Parkas >'}`}</li>
            </ul>
          </span>
        </div>
        <div className="preview_main">
          <LeftNavigation />
          <ProductBody />
        </div>
      </div>
    );
  }
}

export default Preview;
