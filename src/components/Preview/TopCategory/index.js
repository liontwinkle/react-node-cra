import React, { Component } from 'react';

import './style.scss';

class TopCategory extends Component {
  componentDidMount() {

  }

  render() {
    return (
      <div className="top-category_container">
        <ul>
          <li>Men | </li>
          <li>Women | </li>
          <li>Kids | </li>
          <li>Outerwear | </li>
          <li>Gear | </li>
          <li>Home</li>
        </ul>
      </div>
    );
  }
}

export default TopCategory;
