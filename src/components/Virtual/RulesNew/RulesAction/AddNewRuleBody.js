import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import './style.scss';
import { CustomInput, CustomSelect } from 'components/elements';
import {
  basis, match, refer, scope,
} from 'utils/constants';

const AddNewRuleBody = ({
  valueDetails, ruleData,
  handleSelectChange, handleChange,
}) => (
  <Fragment>
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
  </Fragment>
);

AddNewRuleBody.propTypes = {
  valueDetails: PropTypes.array.isRequired,
  ruleData: PropTypes.object.isRequired,
  handleSelectChange: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};

export default AddNewRuleBody;
