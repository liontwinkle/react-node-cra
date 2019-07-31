import React, { useState } from 'react';
import PropTypes from 'prop-types';

function Input(props) {
  const { onChange } = props;

  const [value, setValue] = useState(props.value);

  const handleBlur = () => {
    if (onChange) {
      onChange(value);
    }
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <input
      className="mg-rule-input"
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
    />
  );
}

Input.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
};

Input.defaultProps = {
  value: '',
};

export default Input;
