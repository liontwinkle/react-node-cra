import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const TemplateSection = ({ title, children }) => (
  <div className="temp-section-wrapper">
    <div className="temp-section-title">
      {title}
    </div>
    {children}
  </div>
);

TemplateSection.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

TemplateSection.defaultProps = {
  children: null,
};

export default TemplateSection;
