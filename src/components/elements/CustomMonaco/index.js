import React from 'react';
import PropTypes from 'prop-types';
import MonacoEditor from 'react-monaco-editor';
import uuidv4 from 'uuid/v4';

import './style.scss';

const CustomMonaco = ({
  id,
  className,
  label,
  labelAlignment,
  inlineWidth,
  inline,
  value,
  onChange,
}) => (
  <div className={`mg-monaco-control ${className}`}>
    {label && !inline && (
      <label htmlFor={id} className="mg-monaco-label">
        {label}
      </label>
    )}
    <div className="mg-monaco-wrapper-text">
      {label && inline && (
        <label
          htmlFor={id}
          className={`mg-monaco-label inline ${labelAlignment}`}
          style={{ minWidth: inlineWidth }}
        >
          {label}
        </label>
      )}
      <MonacoEditor
        id={id}
        className="mg-monaco-text"
        value={value}
        language="javascript"
        theme="vs-dark"
        onChange={onChange}
      />
    </div>
  </div>
);

CustomMonaco.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  label: PropTypes.string,
  labelAlignment: PropTypes.string,
  inline: PropTypes.bool,
  inlineWidth: PropTypes.number,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
};

CustomMonaco.defaultProps = {
  id: uuidv4(),
  className: '',
  label: '',
  value: '',
  labelAlignment: '',
  inline: false,
  inlineWidth: 150,
};
export default CustomMonaco;
