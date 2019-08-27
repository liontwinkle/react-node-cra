import React from 'react';
import PropTypes from 'prop-types';
import './style.scss';
import { CustomToggle } from '../../elements';

function DisplaySetting(props) {
  const {
    onChangeHandle,
    nullType,
    strType,
  } = props;
  console.log(nullType);// fixme
  return (
    <div className="export-button">
      <CustomToggle
        label="Null Setting"
        value={nullType}
        onToggle={onChangeHandle('nullType')}
        key="nullType"
      />
      <CustomToggle
        label="String Setting"
        value={strType}
        onToggle={onChangeHandle('strType')}
        key="strType"
      />
    </div>
  );
}

DisplaySetting.propTypes = {
  onChangeHandle: PropTypes.func.isRequired,
  nullType: PropTypes.bool.isRequired,
  strType: PropTypes.bool.isRequired,
};
export default DisplaySetting;
