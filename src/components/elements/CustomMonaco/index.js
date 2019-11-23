import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import PropTypes from 'prop-types';
import uuidv4 from 'uuid/v4';
import { inlineDefaultWidth } from 'utils/constants';

import './style.scss';

const CustomMonaco = ({
  id,
  className,
  label,
  labelAlignment,
  inlineWidth,
  inline,
  value,
  language,
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
        language={language}
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
  language: PropTypes.string,
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
  language: 'json',
  value: '',
  labelAlignment: '',
  inline: false,
  inlineWidth: inlineDefaultWidth,
};
export default CustomMonaco;
