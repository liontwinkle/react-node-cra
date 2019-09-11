import React, {} from 'react';
import PropTypes from 'prop-types';

import CustomCheck from 'components/elements/CustomCheck/index';

import './style.scss';

function ShowFields({
  fields,
  onChange,
  chkValue,
  type,
}) {
  const { length } = fields;
  const unit = Math.ceil(parseInt(length / 2, 10));
  const fields1 = fields.slice(0, unit - 1);
  const fields2 = fields.slice(unit, length - 1);

  const handleChange = value => (e) => {
    const index = fields.indexOf(value);
    onChange(index, e.target.checked);
  };

  return (
    <div className="show-filed-container">
      <div className="show-field-item">
        {fields1.map(item => (
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

      <div className="show-field-item">
        {fields2.map(item => (
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
  chkValue: PropTypes.object.isRequired,
};

export default ShowFields;
