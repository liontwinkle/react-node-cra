import React from 'react';
import PropTypes from 'prop-types';
import { CustomArray, CustomInput, CustomSelectWithLabel } from 'components/elements';

const DefaultSection = ({
  type,
  propertyFieldData,
  toggleValue,
  handleToggleDefault,
  handleChange,
}) => (
  <>
    {
      type === 'toggle' ? (
        <CustomSelectWithLabel
          className="mb-3"
          label="Default"
          value={propertyFieldData.default ? toggleValue[0] : toggleValue[1]}
          items={toggleValue}
          onChange={handleToggleDefault}
        />
      ) : (
        <>
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
            type !== 'image'
            && type !== 'array'
            && type !== 'select' && (
              <CustomInput
                className="mb-3"
                label="Default"
                value={propertyFieldData.default || ''}
                onChange={handleChange('default')}
              />
            )
          }
        </>
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
};

export default DefaultSection;
