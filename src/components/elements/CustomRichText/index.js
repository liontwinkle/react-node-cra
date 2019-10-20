import React from 'react';
import PropTypes from 'prop-types';
import FroalaEditorComponent from 'react-froala-wysiwyg';
import uuidv4 from 'uuid/v4';

import './style.scss';

const CustomRichText = ({
  id,
  className,
  label,
  labelAlignment,
  inlineWidth,
  inline,
  // value,
  // onChange,
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
        className="mg-richtext"
        tag="textarea"
        // value={value}
        // height={200}
        // onTextChange={onChange}
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
  // value: PropTypes.oneOfType([
  //   PropTypes.string,
  //   PropTypes.number,
  // ]),
  // onChange: PropTypes.func.isRequired,
};

CustomRichText.defaultProps = {
  id: uuidv4(),
  className: '',
  label: '',
  // value: '',
  labelAlignment: '',
  inline: false,
  inlineWidth: 150,
};

export default CustomRichText;
