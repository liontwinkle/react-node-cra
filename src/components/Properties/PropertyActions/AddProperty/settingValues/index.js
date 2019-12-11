import React, { useState } from 'react';
// import PropTypes from 'prop-types';

import './style.scss';
// import { CustomInput } from '../../../../elements';

function SettingValues() {
  const [tab, setTab] = useState('basic');
  const handleTab = (type) => () => {
    setTab(type);
  };

  // const [propertyfieldData, setPropertyFieldData] = useState({
  //   key: '',
  //   label: '',
  //   default: '',
  //   template: '',
  //   propertyType: protoType, // { key: 'string', label: 'string' },
  //   section: null,
  //   image: {
  //     name: '',
  //     path: '',
  //     type: '',
  //     imageData: null,
  //   },
  //   order: defaultOrder,
  // });
  // const handleChange = (type) => () => {
  //   console.log(type); // fixme
  // };
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
      <div className="setting-value-body" />
    </div>
  );
}

SettingValues.propTypes = {
  // protoType: PropTypes.string.isRequired,
  // defaultOrder: PropTypes.number.isRequired,
};

export default SettingValues;
