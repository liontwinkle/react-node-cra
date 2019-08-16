import React, {} from 'react';
import './style.scss';
import PropTypes from 'prop-types';
import CustomSelect from 'components/elements/CustomSelect';

function CalcAverage(props) {
  const {
    numberFields,
    // value,
  } = props;
  const handleChange = (val) => {
    console.log('change field>>>>>', val);
  };
  return (
    <div className="calc-container">
      <CustomSelect items={numberFields} onChange={handleChange} />
    </div>
  );
}

CalcAverage.propTypes = {
  numberFields: PropTypes.array.isRequired,
  // value: PropTypes.object
};

export default CalcAverage;
