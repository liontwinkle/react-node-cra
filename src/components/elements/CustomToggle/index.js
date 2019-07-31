import React from 'react';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';

import './style.scss';

const CustomToggle = ({
  id,
  label,
  labelOn,
  labelOff,
  side,
  value,
  onToggle,
}) => (
  <div className="mg-switch-control">
    <div className="mg-switch-wrapper">
      {label && (side === 'left') && (
        <label
          htmlFor={id}
          className="mg-switch-label"
        >
          {label}
        </label>
      )}

      <div
        className={`mg-switch-box${value ? ' mg-switch-on' : ''}`}
        onClick={onToggle}
      >
        {side === 'in' && (
          <span className="mg-switch-text">{value ? labelOn : labelOff}</span>
        )}

        <div className="mg-switch-handle" />
      </div>

      {label && (side === 'right') && (
        <label
          htmlFor={id}
          className="mg-switch-label right"
        >
          {label}
        </label>
      )}
    </div>
  </div>
);

CustomToggle.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  label: PropTypes.string,
  labelOn: PropTypes.string,
  labelOff: PropTypes.string,
  side: PropTypes.string,
  value: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

CustomToggle.defaultProps = {
  id: uuidv4(),
  label: '',
  labelOn: '',
  labelOff: '',
  side: 'left',
};

export default CustomToggle;
