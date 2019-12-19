import React from 'react';
import PropTypes from 'prop-types';
import DefaultSection from './AdvancedSettingComponent/defaultSection';
import TemplateSection from './AdvancedSettingComponent/templateSection';
import { CustomImageUpload, CustomSelectWithLabel } from '../../../../elements';
import AdvancedDescription from './AdvancedSettingComponent/description';

const toggleValue = [
  { label: 'True', key: 'true' },
  { label: 'False', key: 'false' },
];
const AdvancedSetting = ({
  type,
  imageFile,
  imageName,
  propertyFieldData,
  propertyField,
  handleChangeTemplate,
  handleToggleDefault,
  handleChange,
  handleChangeSection,
  handleChangeFileName,
  handleChangeImage,
  handleChangeMonaco,
}) => (
  <div className="setting-advance-body">
    <div className="setting-advance-body__elements">
      <DefaultSection
        type={type}
        toggleValue={toggleValue}
        propertyFieldData={propertyFieldData}
        handleChange={handleChange}
        handleToggleDefault={handleToggleDefault}
        handleChangeMonaco={handleChangeMonaco}
      />
      <TemplateSection
        propertyField={propertyField}
        propertyFieldData={propertyFieldData}
        type={type}
        handleChangeTemplate={handleChangeTemplate}
      />
      {
        type === 'image' && (
          <CustomImageUpload
            className="mb-3"
            label="Image Upload"
            value={imageFile}
            name={imageName}
            onFileNameChange={handleChangeFileName}
            onChange={handleChangeImage}
          />
        )
      }
      <CustomSelectWithLabel
        label="Section"
        value={propertyFieldData.section}
        items={propertyField.sections}
        onChange={handleChangeSection}
      />
    </div>
    <div className="setting-advance-body__description">
      <AdvancedDescription type={type} />
    </div>
  </div>
);

AdvancedSetting.propTypes = {
  type: PropTypes.string.isRequired,
  imageFile: PropTypes.any,
  imageName: PropTypes.string,
  propertyFieldData: PropTypes.object.isRequired,
  propertyField: PropTypes.object.isRequired,
  handleChangeTemplate: PropTypes.func.isRequired,
  handleToggleDefault: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleChangeSection: PropTypes.func.isRequired,
  handleChangeFileName: PropTypes.func.isRequired,
  handleChangeImage: PropTypes.func.isRequired,
  handleChangeMonaco: PropTypes.func.isRequired,
};

AdvancedSetting.defaultProps = {
  imageFile: null,
  imageName: '',
};
export default AdvancedSetting;
