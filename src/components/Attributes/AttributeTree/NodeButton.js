import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const NodeButton = ({
  path, handleAdd, handleEdit, handleRemove, handleTemplate,
}) => (
  <div className="d-flex flex-column">
    {
      (path.length <= 1)
      && (
        <button className="mg-button transparent" onClick={handleAdd}>
          Add Attribute
        </button>
      )
    }

    <button className="mg-button transparent" onClick={handleEdit}>
      Edit
    </button>
    <button className="mg-button transparent" onClick={handleRemove}>
      Delete
    </button>
    <button className="mg-button transparent" onClick={handleTemplate}>
      Set the template
    </button>
  </div>
);

NodeButton.propTypes = {
  path: PropTypes.array.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleTemplate: PropTypes.func.isRequired,
};

export default NodeButton;
