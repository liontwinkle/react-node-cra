import React from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';
import uuidv4 from 'uuid/v4';
import './style.scss';

const CustomMonaco = ({
  id, className, label, value,
}) => (
  <div className={`mg-input-control ${className}`}>
    {label && (
      <label htmlFor={id} className="mg-input-label inline">
        {label}
      </label>
    )}
    <MonacoEditor
      id={id}
      value={value}
      language="javascript"
      theme="vs-dark"
    />
  </div>
);

CustomMonaco.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

CustomMonaco.defaultProps = {
  id: uuidv4(),
  className: '',
  label: '',
  value: '',
};
export default CustomMonaco;
