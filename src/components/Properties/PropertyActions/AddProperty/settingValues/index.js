import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import BasicSetting from './basicSetting';
import AdvancedSetting from './advancedSetting';

function SettingValues({
  protoType,
  defaultOrder,
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
  const handleChange = (type) => (e) => {
    const newPropertyFieldData = {
      ...propertyFieldData,
      [type]: e.target.value,
    };
    setPropertyFieldData(newPropertyFieldData);
  };

  const handleToggleDefault = (value) => {
    console.log('### DEBUG SELECT VALUE: ', value);
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
  defaultOrder: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default SettingValues;
