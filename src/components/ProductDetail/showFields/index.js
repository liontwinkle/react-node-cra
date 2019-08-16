import React, {} from 'react';
import './style.scss';
import CustomCheck from 'components/elements/CustomCheck';
import PropTypes from 'prop-types';

function ShowFields(props) {
  const {
    fields,
  } = props;
  const { length } = fields;
  const unit = Math.ceil(parseInt(length / 2, 10));
  const fields1 = fields.slice(0, unit - 1);
  const fields2 = fields.slice(unit, length - 1);
  const handleChange = (e) => {
    console.log('change field>>>>>', e.target.value);
  };
  return (
    <div className="show-filed-container">
      <div className="show-field-item">
        {
          fields1.map(item => (
            <CustomCheck key={item} value={item} onChange={handleChange} />
          ))
        }
      </div>
      <div className="show-field-item">
        {
          fields2.map(item => (
            <CustomCheck key={item} value={item} onChange={handleChange} />
          ))
        }
      </div>
    </div>
  );
}

ShowFields.propTypes = {
  fields: PropTypes.array.isRequired,
};

export default ShowFields;
