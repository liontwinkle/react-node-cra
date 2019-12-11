import React from 'react';
import PropTypes from 'prop-types';

import { propertyFieldTypes } from 'utils/constants';

import './style.scss';

const SelectProtoType = ({
  handleSelectType,
}) => (
  <div className="select-prototype-container">
    {
      propertyFieldTypes.map((item) => (
        <div key={item.key} className="select-prototype-item" onClick={handleSelectType(item.key)}>
          <img className="select-prototype-item__img" src={item.src} alt="type icon" />
          <span className="select-prototype-item__title">{item.label}</span>
          <span className="select-prototype-item__detail">{item.description}</span>
        </div>
      ))
    }
  </div>
);

SelectProtoType.propTypes = {
  handleSelectType: PropTypes.func.isRequired,
};

export default SelectProtoType;
