import React from 'react';
import PropTypes from 'prop-types';

import { CustomToggle } from 'components/elements';

import './style.scss';

const DisplaySetting = ({ nullType, strType, onChangeHandle }) => (
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

DisplaySetting.propTypes = {
  nullType: PropTypes.bool.isRequired,
  strType: PropTypes.bool.isRequired,
  onChangeHandle: PropTypes.func.isRequired,
};

export default DisplaySetting;
