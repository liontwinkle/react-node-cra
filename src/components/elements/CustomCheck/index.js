/* eslint-disable max-len */
import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const CustomCheck = ({
  value,
  onChange,
  insertValue,
}) => (
  <div className="custom-check-container">
    <div className="pretty p-svg p-curve">
      <input
        type="checkbox"
        id={value}
        checked={insertValue}
        onChange={onChange}
      />
      <div className="state p-success">
        <svg className="svg svg-icon" viewBox="0 0 20 20">
          <path
            d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"
            style={{
              stroke: 'white',
              fill: 'white',
            }}
          />
        </svg>
        <label>{value}</label>
      </div>
    </div>
  </div>
);

CustomCheck.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  insertValue: PropTypes.bool.isRequired,
};

CustomCheck.defaultProps = {
  value: '_id',
};

export default CustomCheck;
