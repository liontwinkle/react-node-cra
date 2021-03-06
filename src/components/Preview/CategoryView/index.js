import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setRootCategory } from 'redux/actions/preview';
import CategoryItem from '../CategoryItem';

import './style.scss';

class CategoryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterData: [],
    };
  }

  componentDidMount() {
    const { categories, selectedCategory } = this.props;
    const willViewCategories = categories.filter((item) => (item.parent_id === selectedCategory._id));
    const data = [];
    willViewCategories.forEach((item) => {
      data.push({
        title: item.name,
        _id: item._id,
        subParentId: item.parent_id,
        childs: categories.filter((categoryItem) => (categoryItem.parent_id === item._id)),
      });
    });
    this.updateState({
      filterData: data,
    });
  }

  componentDidUpdate(prevProps) {
    const { categories, subCategories } = this.props;
    if (prevProps.subCategories !== subCategories) {
      const filterData = [];
      subCategories.forEach((item) => {
        filterData.push({
          _id: item._id,
          title: item.name,
          subParentId: item.parent_id,
          childs: categories.filter((categoryItem) => (categoryItem.parent_id === item._id)),
        });
      });
      this.updateState({
        filterData,
      });
    }
  }

  updateState = (data) => {
    this.setState((prevState) => ({
      ...prevState,
      ...data,
    }));
  };

  render() {
    const { filterData } = this.state;
    return (
      <div className="category-view_container">
        {
          filterData.map((item) => (
            <CategoryItem
              key={item._id}
              subParentId={item.subParentId}
              title={item.title}
              headId={item._id}
              childs={item.childs}
            />
          ))
        }
      </div>
    );
  }
}

CategoryView.propTypes = {
  // rootCategories: PropTypes.array.isRequired,
  // setRootCategory: PropTypes.func.isRequired,
  subCategories: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.object.isRequired,
};

const mapStateToProps = (store) => ({
  rootCategories: store.previewData.rootCategories,
  selectedCategory: store.previewData.selectedCategory,
  categories: store.categoriesData.categories,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setRootCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoryView);
