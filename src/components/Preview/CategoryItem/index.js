import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setPathUrl, setPreviewCategory } from 'redux/actions/preview';

import './style.scss';

function CategoryItem({
  title,
  headId,
  childs,
  setPathUrl,
  subParentId,
  categories,
  setPreviewCategory,
}) {
  const setCurrentItem = (item, pId, pTitle) => {
    setPreviewCategory(item);
    setPathUrl({
      name: item.name,
      id: item._id,
      subParentId: pId,
      parent_name: pTitle,
      parent_id: item.parent_id,
    });
  };

  const handleClick = (item) => () => {
    setCurrentItem(item, subParentId, title);
  };

  const handleSubheaderClick = (itemId) => () => {
    const currentItem = categories.find((categoryItem) => (categoryItem._id === itemId));
    const parentItem = categories.find((categoryItem) => (categoryItem._id === currentItem.parent_id));
    if (parentItem) {
      const subPItem = categories.find((categoryItem) => (categoryItem._id === parentItem.parent_id));
      if (subPItem) {
        setCurrentItem(currentItem, subPItem._id, parentItem.name);
      }
    }
  };

  return (
    <div className="category-item-container">
      <label className="category-item-subHeader" onClick={handleSubheaderClick(headId)}>
        {title}
      </label>
      <ul>
        {
          childs.map((childItem) => (
            <li
              key={childItem._id}
              className="category-child-item"
              onClick={handleClick(childItem)}
            >
              {childItem.name}
            </li>
          ))
        }
      </ul>
    </div>
  );
}

CategoryItem.propTypes = {
  title: PropTypes.string.isRequired,
  headId: PropTypes.number.isRequired,
  subParentId: PropTypes.number.isRequired,
  childs: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  setPathUrl: PropTypes.func.isRequired,
  setPreviewCategory: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  categories: store.categoriesData.categories,
});
const mapDispatchToProps = (dispatch) => bindActionCreators({
  setPathUrl,
  setPreviewCategory,
}, dispatch);


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CategoryItem);
