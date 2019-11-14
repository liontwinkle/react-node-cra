import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const NodeButton = ({
  editable, handleAdd, handleEdit, handleRemove, handleRelate, rootNode, handleTemplate,
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

    {rootNode && (
      <button className="mg-button transparent" onClick={handleRelate}>
        Link with other
      </button>
    )}
    <button className="mg-button transparent" onClick={handleTemplate}>
      Set the template
    </button>
  </div>
);

NodeButton.propTypes = {
  editable: PropTypes.bool.isRequired,
  rootNode: PropTypes.bool.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  handleRelate: PropTypes.func.isRequired,
  handleTemplate: PropTypes.func.isRequired,
};

export default NodeButton;
