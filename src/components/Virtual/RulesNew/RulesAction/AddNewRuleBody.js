import React from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import { CustomInput, CustomSelect } from 'components/elements';
import {
  basis, match, refer, scope, ruleType,
} from 'utils/constants';

const AddNewRuleBody = ({
  valueDetails, ruleData, previewNumber,
  handleSelectChange, handleChange,
}) => (
  <>
    <CustomSelect
      className="mb-3"
      label="Basis"
      placeholder="Select Basis of Rule"
      value={ruleData.basis}
      items={basis}
      onChange={handleSelectChange('basis')}
    />
    <CustomSelect
      className="mb-3"
      label="Refer"
      placeholder="Select Refer of Rule"
      value={ruleData.refer}
      items={refer}
      onChange={handleSelectChange('refer')}
    />
    <CustomSelect
      className="mb-3"
      label="Detail"
      placeholder="Select Detail of Rule"
      value={ruleData.detail}
      items={valueDetails}
      onChange={handleSelectChange('detail')}
    />
    <CustomSelect
      className="mb-3"
      label="Match"
      placeholder="Select matches of Rule"
      value={ruleData.match}
      items={match}
      onChange={handleSelectChange('match')}
    />
    <CustomInput
      className="mb-3"
      label="Criteria"
      inline
      value={ruleData.value}
      onChange={handleChange}
    />
    <CustomSelect
      className="mb-3"
      label="Scope"
      placeholder="Select Scope of Rule"
      value={ruleData.scope}
      items={scope}
      onChange={handleSelectChange('scope')}
    />
    <CustomInput
      className="mb-3"
      label="Preview Number"
      inline
      value={previewNumber}
      onChange={() => {}}
    />
    <CustomSelect
      className="mb-3"
      label="Rule Type"
      inline
      placeholder="Select Scope of Rule"
      value={ruleData.ruleType}
      items={ruleType}
      onChange={handleSelectChange('ruleType')}
    />
  </>
);

AddNewRuleBody.propTypes = {
  previewNumber: PropTypes.number.isRequired,
  ruleData: PropTypes.object.isRequired,
  valueDetails: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
};

export default AddNewRuleBody;
