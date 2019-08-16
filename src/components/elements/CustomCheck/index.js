import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';

const CustomCheck = ({
  value,
  onChange,
}) => (
  <div className="custom-check-container">
    <input
      type="checkbox"
      id={value}
      value={value}
      onChange={onChange}
    />
    <label>{value}</label>
  </div>
);

CustomCheck.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

CustomCheck.defaultProps = {
  value: '_id',
};
export default CustomCheck;
