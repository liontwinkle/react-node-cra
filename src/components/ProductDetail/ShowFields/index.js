import React, { useState } from 'react';
import PropTypes from 'prop-types';

import CustomCheck from 'components/elements/CustomCheck/index';

import './style.scss';

function ShowFields({
  fields,
  onChange,
  onUpdate,
  chkValue,
  type,
}) {
  const [checkAll, setCheckAll] = useState(false);
  const [unCheckAll, setUnCheckAll] = useState(false);

  const handleChange = value => (e) => {
    if (value !== 'allc' && value !== 'allu') {
      const index = fields.indexOf(value);
      onChange(index, e.target.checked);
      if (e.target.checked) {
        setUnCheckAll(false);
      } else {
        setCheckAll(false);
      }
    } else if (value === 'allc') {
      setCheckAll(!checkAll);
      setUnCheckAll(false);
      if (!checkAll) {
        onUpdate('checked');
      }
    } else {
      setUnCheckAll(!unCheckAll);
      setCheckAll(false);
      if (!unCheckAll) {
        onUpdate('unchecked');
      }
    }
  };

  return (
    <div className="show-filed-container">
      <div className="show-field-item">
        <CustomCheck
          insertValue={checkAll}
          value="select all"
          onChange={handleChange('allc')}
        />
        <CustomCheck
          insertValue={unCheckAll}
          value="clear all selections"
          onChange={handleChange('allu')}
        />
        {fields.map(item => (
          <CustomCheck
            key={item}
            insertValue={
              (chkValue[item] === undefined || chkValue[item][type] === undefined)
                ? true
                : chkValue[item][type]
            }
            value={item}
            onChange={handleChange(item)}
          />
        ))}
      </div>
    </div>
  );
}

ShowFields.propTypes = {
  fields: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  chkValue: PropTypes.object.isRequired,
};

export default ShowFields;
