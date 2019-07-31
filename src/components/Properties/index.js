import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PropertyActions from './PropertyActions';

import './style.scss';

class Properties extends Component {
  render() {
    // const { category } = this.props;

    return (
      <div className="mg-properties-container d-flex">
        <div className="mg-properties-content" />

        <PropertyActions />
      </div>
    );
  }
}

Properties.propTypes = {
  category: PropTypes.object,
};

Properties.defaultProps = {
  category: null,
};

const mapStateToProps = store => ({
  category: store.categoriesData.category,
});

export default connect(mapStateToProps)(Properties);
