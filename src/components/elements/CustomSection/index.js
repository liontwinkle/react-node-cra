import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const CustomSection = ({ title, children }) => (
  <div className="mg-section-control">
    <div className="mg-section-title">
      <div className="mg-section-template">
        {title}
      </div>
    </div>

    {children}
  </div>
);

CustomSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.object,
};

CustomSection.defaultProps = {
  children: null,
};

export default CustomSection;
