import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const TemplateText = ({ value }) => (
  <div className="temp-text-wrapper">
    {value}
  </div>
);

TemplateText.propTypes = {
  value: PropTypes.string,
};

TemplateText.defaultProps = {
  value: null,
};

export default TemplateText;
