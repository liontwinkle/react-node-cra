import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import './style.scss';

const CustomInput = ({
  id,
  type,
  className,
  label,
  labelAlignment,
  placeholder,
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
          style={{ width: inlineWidth }}
        >
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        className="mg-input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>

    {hint && (
      <div className="mg-input-hint">{hint}</div>
    )}
  </div>
);

CustomInput.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  type: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  labelAlignment: PropTypes.string,
  placeholder: PropTypes.string,
  inline: PropTypes.bool,
  inlineWidth: PropTypes.number,
  hint: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
};

CustomInput.defaultProps = {
  id: uuidv4(),
  type: 'text',
  className: '',
  label: '',
  labelAlignment: '',
  placeholder: '',
  inline: false,
  inlineWidth: 88,
  hint: '',
  value: '',
};

export default CustomInput;
