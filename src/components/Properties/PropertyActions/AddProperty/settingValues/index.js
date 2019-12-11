import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import BasicSetting from './basicSetting';
import AdvancedSetting from './advancedSetting';

function SettingValues({
  protoType,
  defaultOrder,
  propertyField,
  handleClose,
  handleSubmit,
}) {
  const [tab, setTab] = useState('basic');
  const handleTab = (type) => () => {
    setTab(type);
  };

  const [propertyFieldData, setPropertyFieldData] = useState({
    key: '',
    label: '',
    default: null,
    template: '',
    propertyType: protoType, // { key: 'string', label: 'string' },
    section: null,
    image: {
      name: '',
      path: '',
      type: '',
      imageData: null,
    },
    order: defaultOrder,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');

  const handleChangeImage = (data) => {
    if (data.length > 0) {
      const { file, fileType } = data[0];
      setImageFile(data);
      if (fileType && fileType.indexOf('image/') === 0) {
        if (file) {
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            () => {
              const newFile = {
                ...propertyFieldData,
                image: {
                  name: imageName,
                  path: file.name,
                  type: fileType,
                  imageData: reader.result,
                },
              };
              setPropertyFieldData(newFile);
            },
            false,
          );
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleChangeFileName = (e) => {
    e.persist();
    setImageName(e.target.value);
  };

  const handleChange = (type) => (e) => {
    const newPropertyFieldData = {
      ...propertyFieldData,
      [type]: e.target.value,
    };
    setPropertyFieldData(newPropertyFieldData);
  };

  const handleToggleDefault = (value) => {
    console.log('### DEBUG SELECT VALUE: ', value);
    const newClient = {
      ...propertyFieldData,
      default: (value.key === 'true'),
    };
    setPropertyFieldData(newClient);
  };

  const handleChangeTemplate = (value) => {
    const newClient = {
      ...propertyFieldData,
      template: value,
    };
    setPropertyFieldData(newClient);
  };

  const handleChangeSection = (section) => {
    const newClient = {
      ...propertyFieldData,
      section,
    };
    setPropertyFieldData(newClient);
  };

  return (
    <div className="setting-value-container">
      <div className="setting-value-header">
        <span
          className={`setting-value-header__tabItem ${tab === 'basic' ? 'active' : ''}`}
          onClick={handleTab('basic')}
        >
          Basic Setting
        </span>
        <span
          className={`setting-value-header__tabItem ${tab === 'advanced' ? 'active' : ''}`}
          onClick={handleTab('advanced')}
        >
          Advanced Setting
        </span>
      </div>
      <div className="setting-value-body">
        {
          tab === 'basic' && (
            <BasicSetting
              propertyFieldData={propertyFieldData}
              handleChange={handleChange}
            />
          )
        }
        {
          tab === 'advanced' && (
            <AdvancedSetting
              type={propertyFieldData.propertyType.key}
              propertyFieldData={propertyFieldData}
              handleChange={handleChange}
              handleToggleDefault={handleToggleDefault}
              propertyField={propertyField}
              handleChangeTemplate={handleChangeTemplate}
              handleChangeSection={handleChangeSection}
              handleChangeFileName={handleChangeFileName}
              handleChangeImage={handleChangeImage}
              imageFile={imageFile}
              imageName={imageName}
            />
          )
        }
        <div className="add-property-content__action">
          <button
            className="mg-button secondary"
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            className="mg-button primary"
            onClick={handleSubmit(propertyFieldData)}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

SettingValues.propTypes = {
  protoType: PropTypes.object.isRequired,
  propertyField: PropTypes.object.isRequired,
  defaultOrder: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default SettingValues;
