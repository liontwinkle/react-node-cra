import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const TemplateString = ({ value }) => (
  <div className="temp-string-wrapper">
    {value}
  </div>
);

TemplateString.propTypes = {
  value: PropTypes.string,
};

TemplateString.defaultProps = {
  value: null,
};

export default TemplateString;
