import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setPathUrl } from 'redux/actions/preview';

import './style.scss';

function CategoryItem({
  title,
  childs,
  setPathUrl,
  subParentId,
}) {
  const handleClick = (item) => () => {
    setPathUrl({
      name: item.name,
      id: item._id,
      subParentId,
      parent_name: title,
      parent_id: item.parent_id,
    });
  };

  return (
    <div className="category-item-container">
      <label>
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
  subParentId: PropTypes.number.isRequired,
  childs: PropTypes.array.isRequired,
  setPathUrl: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setPathUrl,
}, dispatch);

export default connect(
  null,
  mapDispatchToProps,
)(CategoryItem);
