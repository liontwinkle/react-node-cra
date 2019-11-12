import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import './style.scss';

const TemplateToggle = ({
  id,
  label,
  side,
  value,
  className,
}) => (
  <div className={`template-switch-control ${className}`}>
    {label && (side === 'left') && (
      <label
        htmlFor={id}
        className="mg-switch-label"
      >
        {label}
      </label>
    )}

    <div
      className={`template-switch-box ${value ? 'checked' : 'unchecked'}`}
    />
  </div>
);

TemplateToggle.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  label: PropTypes.string,
  side: PropTypes.string,
  value: PropTypes.bool,
};

TemplateToggle.defaultProps = {
  id: uuidv4(),
  className: '',
  label: '',
  side: 'left',
  value: false,
};

export default TemplateToggle;
