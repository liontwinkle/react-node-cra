import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setPreviewCategory, movePointedPath } from 'redux/actions/preview';
import TopCategory from '../../components/Preview/TopCategory';
import LeftNavigation from '../../components/Preview/LeftNavigation';
import ProductBody from '../../components/Preview/ProductBody';
import CategoryView from '../../components/Preview/CategoryView';

import './style.scss';

class Preview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subCategories: [],
    };
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps) {
    const { selectedCategory, categories } = this.props;
    if (selectedCategory._id && selectedCategory !== prevProps.selectedCategory) {
      const subCategories = categories.filter((categoryItem) => (categoryItem.parent_id === selectedCategory._id));
      this.updateState({
        subCategories,
      });
    }
  }

  updateState = (data) => {
    this.setState((prevState) => ({
      ...prevState,
      ...data,
    }));
  };

  handleTopURLClick = (id) => () => {
    const { categories, setPreviewCategory, movePointedPath } = this.props;
    const findCategoryItem = categories.find((item) => (item._id === id));
    setPreviewCategory(findCategoryItem);
    movePointedPath(id);
  };

  render() {
    const { urlPath } = this.props;
    const { subCategories } = this.state;
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
          <CategoryView subCategories={subCategories} />
          {
            subCategories.length === 0 && (
              <>
                <LeftNavigation />
                <ProductBody />
              </>
            )
          }
        </div>
      </div>
    );
  }
}

Preview.propTypes = {
  urlPath: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.object.isRequired,
  setPreviewCategory: PropTypes.func.isRequired,
  movePointedPath: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  urlPath: store.previewData.urlPath,
  selectedCategory: store.previewData.selectedCategory,
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
