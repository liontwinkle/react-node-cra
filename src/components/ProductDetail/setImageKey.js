import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'react-tippy';
import SaveIcon from '@material-ui/icons/Save';
import { CustomInput, IconButton } from 'components/elements';

const SetImageKey = ({ imageKeySet, handleImageKeyChange, handleSaveImageKey }) => (
  <div className="set_imageKey">
    <CustomInput
      className="mb-3"
      label="Image Key"
      inline
      value={imageKeySet}
      onChange={handleImageKeyChange}
    />
    <Tooltip
      title="Preview Products for Current Rule"
      position="right"
      arrow
    >
      <IconButton>
        <SaveIcon style={{ fontSize: 20 }} onClick={handleSaveImageKey} />
      </IconButton>
    </Tooltip>
  </div>
);

SetImageKey.propTypes = {
  imageKeySet: PropTypes.string.isRequired,
  handleImageKeyChange: PropTypes.func.isRequired,
  handleSaveImageKey: PropTypes.func.isRequired,
};

export default SetImageKey;
