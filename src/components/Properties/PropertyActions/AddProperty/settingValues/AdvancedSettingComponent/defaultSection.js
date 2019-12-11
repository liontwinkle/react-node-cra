import React from 'react';
import PropTypes from 'prop-types';
import { CustomInput, CustomSelectWithLabel } from 'components/elements';

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
          value={propertyFieldData.default}
          items={toggleValue}
          onChange={handleToggleDefault}
        />
      ) : (
        <>
          {
            type !== 'image'
            && type !== 'select' && (
              <CustomInput
                className="mb-3"
                label="Default"
                value={propertyFieldData.label}
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
  toggleValue: PropTypes.object.isRequired,
  handleToggleDefault: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default DefaultSection;
