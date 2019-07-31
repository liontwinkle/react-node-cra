import React from 'react';
import PropTypes from 'prop-types';

function Toggle(props) {
  const { value, onToggle } = props;

  const handleToggle = () => {
    if (onToggle) {
      onToggle(value === 'and' ? 'or' : 'and');
    }
  };

  return (
    <div
      className={`mg-glue-toggle ${value}`}
      onClick={handleToggle}
    >
      <div className={value === 'and' ? 'active' : ''}>And</div>
      <div className={value === 'or' ? 'active' : ''}>Or</div>
    </div>
  );
}

Toggle.propTypes = {
  value: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Toggle;
