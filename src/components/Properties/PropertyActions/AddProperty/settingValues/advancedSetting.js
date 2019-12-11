import React from 'react';
import PropTypes from 'prop-types';
import DefaultSection from './AdvancedSettingComponent/defaultSection';
// import { propertyFieldTypes } from 'utils/constants';

const toggleValue = [
  { label: 'True', key: 'true' },
  { label: 'False', key: 'false' },
];
const AdvancedSetting = ({
  type,
  propertyFieldData,
  handleToggleDefault,
  handleChange,
}) => (
  <div className="setting-advance-body">
    <div className="setting-advance-body__elements">
      <DefaultSection
        type={type}
        toggleValue={toggleValue}
        propertyFieldData={propertyFieldData}
        handleChange={handleChange}
        handleToggleDefault={handleToggleDefault}
      />
    </div>
    <div className="setting-advance-body__description" />
  </div>
);

AdvancedSetting.propTypes = {
  type: PropTypes.string.isRequired,
  propertyFieldData: PropTypes.object.isRequired,
  handleToggleDefault: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};
export default AdvancedSetting;
