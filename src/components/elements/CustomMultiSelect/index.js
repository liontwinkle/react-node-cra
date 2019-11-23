import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { inlineDefaultWidth } from 'utils/constants';

import './style.scss';

const customStyles = {
  menu: (provided) => ({
    ...provided,
    borderBottom: '1px dotted pink',
    position: 'relative',
    top: -8,
    padding: 20,
    display: 'block !important',
  }),
};

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
    <div className={`mg-select-container multi ${className}`}>
      {label && !inline && (
        <label className="mg-select-label">
          {label}
        </label>
      )}

      <div className="mg-select-wrapper multi">
        {label && inline && (
          <label
            className={`mg-select-label inline ${labelAlignment}`}
            style={{ minWidth: inlineWidth }}
          >
            {label}
          </label>
        )}

        <Select
          styles={customStyles}
          className={className}
          options={items}
          value={value}
          width="200px"
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
  inlineWidth: inlineDefaultWidth,
  hint: '',
};

export default CustomMultiSelect;
