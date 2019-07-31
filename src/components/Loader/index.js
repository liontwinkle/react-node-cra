import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';

const Loader = ({ size, color }) => (
  <div className={`app-loader ${size} ${color}`} />
);

Loader.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
};

Loader.defaultProps = {
  size: '',
  color: '',
};

export default Loader;
