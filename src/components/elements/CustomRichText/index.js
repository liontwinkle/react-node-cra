/* eslint-disable import/extensions */
import React from 'react';
import PropTypes from 'prop-types';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import CodeMirror from 'codemirror/lib/codemirror.js';
import uuidv4 from 'uuid/v4';

import './style.scss';

const CustomRichText = ({
  id,
  className,
  label,
  labelAlignment,
  inlineWidth,
  inline,
  value,
  onChange,
}) => (
  <div className={`mg-richtext-control ${className}`}>
    {label && !inline && (
      <label htmlFor={id} className="mg-richtext-label">
        {label}
      </label>
    )}
    <div className="mg-richtext-wrapper-text">
      {label && inline && (
        <label
          htmlFor={id}
          className={`mg-richtext-label inline ${labelAlignment}`}
          style={{ minWidth: inlineWidth }}
        >
          {label}
        </label>
      )}
      <FroalaEditorComponent
        id={id}
        tag="textarea"

        config={{
          placeholderText: 'Edit Your Content Here!',
          charCounterCount: false,
          codeMirror: CodeMirror,
          codeBeautifierOptions: {
            end_with_newline: true,
            indent_inner_html: true,
            extra_liners: "['p','h1','h2','h3','h4','h5','h6','blockquote','pre','ul','ol','table','dl']",
            brace_style: 'expand',
            indent_char: ' ',
            indent_size: 4,
            wrap_line_length: 0,
          },
        }}
        onModelChange={onChange}
        model={value}
      />
    </div>
  </div>
);

CustomRichText.propTypes = {
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

CustomRichText.defaultProps = {
  id: uuidv4(),
  className: '',
  label: '',
  value: '',
  labelAlignment: '',
  inline: false,
  inlineWidth: 150,
};

export default CustomRichText;
