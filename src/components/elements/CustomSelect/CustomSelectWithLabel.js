import React from 'react';
import PropTypes from 'prop-types';

import { inlineDefaultWidth } from 'utils/constants';
import CustomSelect from '.';

import './style.scss';

const CustomSelectWithLabel = ({
  className,
  label,
  labelAlignment,
  placeholder,
  inline,
  inlineWidth,
  hint,
  value,
  items,
  onChange,
}) => (
  <div className={`mg-select-container ${className}`}>
    {label && !inline && (
      <label className="mg-select-label">
        {label}
      </label>
    )}

    <div className="mg-select-wrapper">
      {label && inline && (
        <label
          className={`mg-select-label inline ${labelAlignment}`}
          style={{ minWidth: inlineWidth }}
        >
          {label}
        </label>
      )}

      <CustomSelect
        className={className}
        placeholder={placeholder}
        value={value}
        items={items}
        onChange={onChange}
      />
    </div>

    {hint && (
      <div className="mg-select-hint">{hint}</div>
    )}
  </div>
);

CustomSelectWithLabel.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  labelAlignment: PropTypes.string,
  placeholder: PropTypes.string,
  hint: PropTypes.string,
  inline: PropTypes.bool,
  inlineWidth: PropTypes.number,
  value: PropTypes.object,
  items: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

CustomSelectWithLabel.defaultProps = {
  className: '',
  label: '',
  labelAlignment: '',
  placeholder: '',
  inline: false,
  inlineWidth: inlineDefaultWidth,
  hint: '',
  value: null,
};

export default CustomSelectWithLabel;
