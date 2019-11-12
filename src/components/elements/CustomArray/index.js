import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import './style.scss';

const CustomArray = ({
  id,
  type,
  className,
  label,
  labelAlignment,
  placeholder,
  min,
  inline,
  inlineWidth,
  hint,
  value,
  onChange,
}) => (
  <div className={`mg-input-control ${className}`}>
    {label && !inline && (
      <label htmlFor={id} className="mg-input-label">
        {label}
      </label>
    )}

    <div className="mg-input-wrapper">
      {label && inline && (
        <label
          htmlFor={id}
          className={`mg-input-label inline ${labelAlignment}`}
          style={{ minWidth: inlineWidth }}
        >
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        className="mg-input-array"
        placeholder={placeholder}
        min={min}
        value={value}
        onChange={onChange}
      />
    </div>

    {hint && (
      <div className="mg-input-hint">{hint}</div>
    )}
  </div>
);

CustomArray.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  type: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  labelAlignment: PropTypes.string,
  placeholder: PropTypes.string,
  hint: PropTypes.string,
  min: PropTypes.number,
  inline: PropTypes.bool,
  inlineWidth: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
};

CustomArray.defaultProps = {
  id: uuidv4(),
  type: 'text',
  className: '',
  label: '',
  labelAlignment: '',
  placeholder: '',
  min: undefined,
  inline: false,
  inlineWidth: 150,
  hint: '',
  value: '',
};

export default CustomArray;
