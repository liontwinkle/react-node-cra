import React from 'react';
import PropTypes from 'prop-types';
import { CustomInput } from 'components/elements';

import { hints } from 'utils/constants';

const BasicSetting = ({
  handleChange,
  propertyFieldData,
}) => (
  <div className="basic-setting-body">
    <div className="basic-setting-body__elements">
      <CustomInput
        className="mb-3"
        label="Label"
        value={propertyFieldData.label}
        onChange={handleChange('label')}
      />
      <CustomInput
        className="mb-3"
        label="Key"
        value={propertyFieldData.key}
        onChange={handleChange('key')}
      />
    </div>
    <div className="basic-setting-body__description">
      <span>{hints.basic}</span>
    </div>
  </div>
);

BasicSetting.propTypes = {
  handleChange: PropTypes.func.isRequired,
  propertyFieldData: PropTypes.object.isRequired,
};

export default BasicSetting;
