import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const CustomTab = ({
  tabs,
  value,
  onClick,
}) => (
  <div className="mg-tab-container d-flex">
    {tabs.map((tab) => (
      <div
        className={`mg-tab${tab.value === value ? ' active' : ''}`}
        onClick={onClick(tab.value)}
        key={tab.value}
      >
        {tab.label}
      </div>
    ))}
  </div>
);

CustomTab.propTypes = {
  tabs: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default CustomTab;
