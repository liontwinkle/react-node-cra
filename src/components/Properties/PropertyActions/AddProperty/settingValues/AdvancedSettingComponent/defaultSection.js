import React from 'react';
import PropTypes from 'prop-types';
import {
  CustomArray, CustomInput, CustomSelectWithLabel, CustomText, CustomMonaco, CustomRichText,
} from 'components/elements';

const DefaultSection = ({
  type,
  propertyFieldData,
  toggleValue,
  handleToggleDefault,
  handleChange,
  handleChangeMonaco,
}) => (
  <>
    {
      type === 'toggle' && (
        <CustomSelectWithLabel
          className="mb-3"
          label="Default"
          value={propertyFieldData.default ? toggleValue[0] : toggleValue[1]}
          items={toggleValue}
          onChange={handleToggleDefault}
        />
      )
    }
    {
      type === 'array' && (
        <CustomArray
          className="mb-3"
          label="Default"
          value={propertyFieldData.default || ''}
          onChange={handleChange('default')}
        />
      )
    }
    {
      type === 'text' && (
        <CustomText
          className="mb-3"
          label="Default"
          value={propertyFieldData.default || ''}
          onChange={handleChange('default')}
        />
      )
    }
    {
      type === 'monaco' && (
        <CustomMonaco
          className="mb-3"
          label="Default"
          value={propertyFieldData.default || ''}
          onChange={handleChangeMonaco('default')}
        />
      )
    }
    {
      type === 'richtext' && (
        <CustomRichText
          className="mb-3"
          label="Default"
          value={propertyFieldData.default || ''}
          onChange={handleChangeMonaco('default')}
        />
      )
    }
    {
      (type === 'urlpath'
      || type === 'string') && (
        <CustomInput
          className="mb-3"
          label="Default"
          value={propertyFieldData.default || ''}
          onChange={handleChange('default')}
        />
      )
    }
  </>
);

DefaultSection.propTypes = {
  type: PropTypes.string.isRequired,
  propertyFieldData: PropTypes.object.isRequired,
  toggleValue: PropTypes.array.isRequired,
  handleToggleDefault: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleChangeMonaco: PropTypes.func.isRequired,
};

export default DefaultSection;
