import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const TemplateSection = ({ title, children }) => (
  <div className="mg-section-control">
    <div className="mg-section-title">
      <div className="mg-section-template">
        {title}
      </div>
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
