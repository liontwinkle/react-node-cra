import React from 'react';
import './style.scss';
import CustomCheck from 'components/elements/CustomCheck';

function ShowFields() {
  const handleChange = (e) => {
    console.log('change field>>>>>', e.target.value);
  };
  return (
    <div className="show-filed-container">
      <div className="show-field-item">
        <CustomCheck value="field1" onChange={handleChange} />
      </div>
      <div className="show-field-item">
        <CustomCheck value="field1" onChange={handleChange} />
      </div>
      <div className="show-field-item">
        <CustomCheck value="field1" onChange={handleChange} />
      </div>
      <div className="show-field-item">
        <CustomCheck value="field1" onChange={handleChange} />
      </div>
    </div>
  );
}

export default ShowFields;
