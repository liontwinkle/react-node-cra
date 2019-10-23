import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const CustomCheck = ({
  value,
  onChange,
  insertValue,
}) => (
  <div className="custom-check-container">
    <input
      type="checkbox"
      id={value}
      checked={insertValue}
      onChange={onChange}
    />
    <label>{value}</label>
  </div>
);

CustomCheck.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  insertValue: PropTypes.bool.isRequired,
};

CustomCheck.defaultProps = {
  value: '_id',
};

export default CustomCheck;
