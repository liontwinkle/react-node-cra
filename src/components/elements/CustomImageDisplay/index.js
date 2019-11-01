import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import './style.scss';


const CustomImageDisplay = ({
  id,
  className,
  label,
  labelAlignment,
  inline,
  inlineWidth,
  hint,
  value,
}) => (
  <div className={`mg-display-control ${className}`}>
    {label && !inline && (
      <label htmlFor={id} className="mg-display-label">
        {label}
      </label>
    )}

    <div className="mg-display-wrapper">
      {label && inline && (
        <label
          htmlFor={id}
          className={`mg-display-label inline ${labelAlignment}`}
          style={{ minWidth: inlineWidth }}
        >
          {label}
        </label>
      )}

      <div className="mg-display-image">
        <img src={value} alt="User" />
      </div>
    </div>

    {hint && (
      <div className="mg-input-hint">{hint}</div>
    )}
  </div>
);

CustomImageDisplay.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  label: PropTypes.string,
  labelAlignment: PropTypes.string,
  inline: PropTypes.bool,
  inlineWidth: PropTypes.number,
  hint: PropTypes.string,
  value: PropTypes.any,
};

CustomImageDisplay.defaultProps = {
  id: uuidv4(),
  className: '',
  label: '',
  labelAlignment: '',
  inline: false,
  inlineWidth: 150,
  hint: '',
  value: '',
};

export default CustomImageDisplay;
