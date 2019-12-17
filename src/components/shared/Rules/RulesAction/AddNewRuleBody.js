import React from 'react';
import PropTypes from 'prop-types';

import { CustomInput, CustomMultiSelect, CustomSelect } from 'components/elements';
import {
  basis, match, refer, scope, ruleType,
} from 'utils/constants';

import './style.scss';

const AddNewRuleBody = ({
  valueDetails, ruleData, previewNumber, propertyFields,
  handleSelectChange, handleChange, category,
  getAvailableData,
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
      value={ruleData.key}
      items={valueDetails}
      onChange={handleSelectChange('key')}
    />
    {ruleData.key && (
      <span className="rule-preview-value">
        <label onClick={getAvailableData}>Click here to view available Values.</label>
      </span>
    )}
    <CustomSelect
      className="mb-3"
      label="Match"
      placeholder="Select matches of Rule"
      value={ruleData.type}
      items={match}
      onChange={handleSelectChange('type')}
    />
    {
      ruleData.ruleType.key === 'normal' ? (
        <CustomInput
          className="mb-3"
          label="Criteria"
          inline
          value={ruleData.criteria}
          onChange={handleChange}
        />
      ) : (
        <CustomMultiSelect
          className="mb-3 multi-select"
          label="Criteria"
          inline
          value=""
          items={propertyFields}
          onChange={() => {}}
        />
      )
    }
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
      label="Matching SKUs"
      inline
      value={previewNumber}
      onChange={() => {}}
    />
    {((category.parent_id !== undefined && category.parent_id === null)
      || (category.group_id !== undefined && category.group_id === null))
    && (
      <CustomSelect
        className="mb-3"
        label="Rule Type"
        inline
        placeholder="Select Scope of Rule"
        value={ruleData.ruleType}
        items={ruleType}
        onChange={handleSelectChange('ruleType')}
      />
    )}
  </>
);

AddNewRuleBody.propTypes = {
  previewNumber: PropTypes.number.isRequired,
  ruleData: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  valueDetails: PropTypes.array.isRequired,
  propertyFields: PropTypes.array.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  getAvailableData: PropTypes.func.isRequired,
};

export default AddNewRuleBody;
