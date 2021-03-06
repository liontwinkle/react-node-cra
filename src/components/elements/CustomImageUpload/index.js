import React from 'react';
import PropTypes from 'prop-types';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';
import uuidv4 from 'uuid/v4';
import CustomInput from '../CustomInput';

import './style.scss';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginImageEdit);

const CustomImageUpload = ({
  id,
  className,
  label,
  labelAlignment,
  inline,
  inlineWidth,
  hint,
  value,
  name,
  onChange,
  onFileNameChange,
  getWrapper,
}) => (
  <div className={`mg-upload-control ${className}`}>
    {label && !inline && (
      <label htmlFor={id} className="mg-upload-label">
        {label}
      </label>
    )}

    <div className="mg-upload-wrapper">
      {label && inline && (
        <label
          htmlFor={id}
          className={`mg-upload-label inline ${labelAlignment}`}
          style={{ minWidth: inlineWidth }}
        >
          {label}
        </label>
      )}
      <CustomInput className="mb-3" onChange={onFileNameChange} value={name} />
      <FilePond
        ref={getWrapper}
        files={value}
        onupdatefiles={onChange}
      />
    </div>

    {hint && (
      <div className="mg-input-hint">{hint}</div>
    )}
  </div>
);

CustomImageUpload.propTypes = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  className: PropTypes.string,
  label: PropTypes.string,
  labelAlignment: PropTypes.string,
  hint: PropTypes.string,
  name: PropTypes.string,
  inline: PropTypes.bool,
  inlineWidth: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  onFileNameChange: PropTypes.func.isRequired,
  getWrapper: PropTypes.func,
};

CustomImageUpload.defaultProps = {
  id: uuidv4(),
  className: '',
  name: 'image',
  label: '',
  labelAlignment: '',
  inline: false,
  inlineWidth: '20%',
  hint: '',
  value: '',
  getWrapper: null,
};

export default CustomImageUpload;
