import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TopCategory from '../../components/Preview/TopCategory';
// import LeftNavigation from '../../components/Preview/LeftNavigation';
// import ProductBody from '../../components/Preview/ProductBody';
import CategoryView from '../../components/Preview/CategoryView';

import './style.scss';

class Preview extends Component {
  componentDidMount() {

  }

  render() {
    const { urlPath } = this.props;
    return (
      <div className="preview_container">
        <div className="preview_top">
          <TopCategory />
          <span className="preview_route">
            <ul>
              {
                urlPath.map((item) => (
                  <li key={item.id}>{`${item.name} >`}</li>
                ))
              }
            </ul>
          </span>
        </div>
        <div className="preview_main">
          {/* <LeftNavigation /> */}
          {/* <ProductBody /> */}
          <CategoryView />
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  urlPath: PropTypes.array.isRequired,
};

const mapStateToProps = (store) => ({
  urlPath: store.previewData.urlPath,
});

export default connect(
  mapStateToProps,
)(Preview);
