import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import './style.scss';

function CustomMultiSelect({
  className,
  label,
  labelAlignment,
  inline,
  inlineWidth,
  hint,
  items,
  value,
  onChange,
}) {
  return (
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

        <Select
          className={className}
          options={items}
          value={value}
          onChange={onChange}
          isMulti
        />
      </div>

      {hint && (
        <div className="mg-select-hint">{hint}</div>
      )}
    </div>
  );
}

CustomMultiSelect.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  labelAlignment: PropTypes.string,
  hint: PropTypes.string,
  inline: PropTypes.bool,
  inlineWidth: PropTypes.number,
  items: PropTypes.array.isRequired,
  value: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

CustomMultiSelect.defaultProps = {
  className: '',
  label: '',
  labelAlignment: '',
  inline: false,
  inlineWidth: 150,
  hint: '',
};

export default CustomMultiSelect;
