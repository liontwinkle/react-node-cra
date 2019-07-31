import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const IconButton = ({ className, children, onClick }) => (
  <div
    className={`icon-button d-flex-center ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

IconButton.propTypes = {
  className: PropTypes.string,
  children: PropTypes.object.isRequired,
  onClick: PropTypes.func,
};

IconButton.defaultProps = {
  className: '',
  onClick: null,
};

export default IconButton;
