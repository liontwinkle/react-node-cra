import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const NodeButton = ({
  editable, handleAdd, handleEdit, handleRemove,
}) => (
  <div className="d-flex flex-column">
    <button className="mg-button transparent" onClick={handleAdd}>
      Add Child
    </button>

    {editable && (
      <button className="mg-button transparent" onClick={handleEdit}>
        Edit Category
      </button>
    )}

    <button className="mg-button transparent" onClick={handleRemove}>
      Delete Category
    </button>
  </div>
);

NodeButton.propTypes = {
  editable: PropTypes.bool.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
};

export default NodeButton;
