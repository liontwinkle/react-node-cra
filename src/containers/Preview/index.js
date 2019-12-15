import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPreviewCategory, movePointedPath } from 'redux/actions/preview';
import TopCategory from '../../components/Preview/TopCategory';
// import LeftNavigation from '../../components/Preview/LeftNavigdjfghskdjghskdgskjhgksdfgsjgation';
// import ProductBody from '../../components/Preview/ProductBody';
import CategoryView from '../../components/Preview/CategoryView';

import './style.scss';

class Preview extends Component {
  componentDidMount() {

  }

  handleTopURLClick = (id) => () => {
    const { categories, setPreviewCategory, movePointedPath } = this.props;
    const findCategoryItem = categories.find((item) => (item._id === id));
    setPreviewCategory(findCategoryItem);
    movePointedPath(id);
  };

  render() {
    const { urlPath } = this.props;
    return (
      <div className="preview_container">
        <div className="preview_top">
          <TopCategory />
          <span className="preview_route">
            <ul className="url_path">
              {
                urlPath.map((item) => (
                  <li key={item.id} onClick={this.handleTopURLClick(item.id)}>{`${item.name} >`}</li>
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
  categories: PropTypes.array.isRequired,
  setPreviewCategory: PropTypes.func.isRequired,
  movePointedPath: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  urlPath: store.previewData.urlPath,
  categories: store.categoriesData.categories,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setPreviewCategory,
  movePointedPath,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Preview);
