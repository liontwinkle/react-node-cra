import React, { useState } from 'react';
import PropTypes from 'prop-types';

import CustomModalDialog from 'components/elements/CustomModalDialog';
import SelectProtoType from './seletProtoType';

import './style.scss';
import SettingValues from './settingValues';

const SELECT_PROTOTYPE = 0;
const SETTING_VALUES = 1;

const SELECT_PROTOTYPE_LABEL = 'Select A Type For Your Properties';
const SETTING_VALUES_LABEL = 'Add New Property';

function AddProperty({
  open,
  handleClose,
}) {
  const [step, setStep] = useState(SELECT_PROTOTYPE);

  const [title, setTitle] = useState(SELECT_PROTOTYPE_LABEL);

  const [selectedType, setSelectedType] = useState(null);

  const handleSubmit = () => {
    console.log('Click the submit');
  };

  const handleSelectType = (type) => () => {
    setStep(SETTING_VALUES);
    setTitle(SETTING_VALUES_LABEL);
    setSelectedType(type);
  };

  return (
    <CustomModalDialog
      title={title}
      className="add-property-fields__container"
      handleClose={handleClose}
      open={open}
    >
      <div className="add-property-content">
        <div className="add-property-content__body">
          {
            step === SELECT_PROTOTYPE && (
              <SelectProtoType handleSelectType={handleSelectType} />
            )
          }
          {
            step === SETTING_VALUES && (
              <SettingValues protoType={selectedType} />
            )
          }
        </div>
        {
          step !== SELECT_PROTOTYPE && (
            <div className="add-property-content__action">
              <button
                className="mg-button secondary"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="mg-button primary"
                onClick={handleSubmit}
              >
                Save
              </button>
            </div>
          )
        }
      </div>

    </CustomModalDialog>
  );
}

AddProperty.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default AddProperty;
