import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import { inlineDefaultWidth } from 'utils/constants';

import './style.scss';

const CustomInput = ({
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
  getWrapper,
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
        ref={getWrapper}
        id={id}
        type={type}
        className="mg-input"
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
  hint: PropTypes.string,
  min: PropTypes.number,
  inline: PropTypes.bool,
  inlineWidth: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  getWrapper: PropTypes.func,
};

CustomInput.defaultProps = {
  id: uuidv4(),
  type: 'text',
  className: '',
  label: '',
  labelAlignment: '',
  placeholder: 'Please insert input type...',
  min: undefined,
  inline: false,
  inlineWidth: inlineDefaultWidth,
  hint: '',
  value: '',
  getWrapper: null,
};

export default CustomInput;
