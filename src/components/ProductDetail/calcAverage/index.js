import React, {} from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import CustomSelect from 'components/elements/CustomSelect';

function CalcAverage(props) {
  const {
    numberFields,
    value,
    onChange,
  } = props;
  const handleChange = (val) => {
    console.log('change field>>>>>', val);
    onChange(val);
  };
  return (
    <div className="calc-container">
      <CustomSelect value={value} items={numberFields} onChange={handleChange} />
    </div>
  );
}

CalcAverage.propTypes = {
  numberFields: PropTypes.array.isRequired,
  value: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default CalcAverage;
