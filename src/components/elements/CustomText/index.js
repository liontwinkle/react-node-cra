import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import './style.scss';

const CustomText = ({
  id,
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

    <div className="mg-input-wrapper-text">
      {label && inline && (
        <label
          htmlFor={id}
          className={`mg-input-label inline ${labelAlignment}`}
          style={{ minWidth: inlineWidth }}
        >
          {label}
        </label>
      )}

      <textarea
        id={id}
        className="mg-input-text"
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

CustomText.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  label: PropTypes.string,
  labelAlignment: PropTypes.string,
  placeholder: PropTypes.string,
  hint: PropTypes.string,
  inline: PropTypes.bool,
  inlineWidth: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
};

CustomText.defaultProps = {
  id: uuidv4(),
  className: '',
  label: '',
  labelAlignment: '',
  placeholder: '',
  inline: false,
  inlineWidth: '20%',
  hint: '',
  value: '',
};

export default CustomText;
