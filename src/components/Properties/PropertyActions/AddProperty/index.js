import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import CustomModalDialog from 'components/elements/CustomModalDialog';

import { updatePropertyField } from 'redux/actions/propertyFields';
import { updateDefaultOnCategory } from 'redux/actions/categories';
import { updateDefaultOnAttriute } from 'redux/actions/attribute';
import SettingValues from './settingValues';
import SelectProtoType from './seletProtoType';

import './style.scss';

const SELECT_PROTOTYPE = 0;
const SETTING_VALUES = 1;

const SELECT_PROTOTYPE_LABEL = 'Select A Type For Your Properties';
const SETTING_VALUES_LABEL = 'Add New Property';

function AddProperty({
  open,
  defaultOrder,
  propertyField,
  handleClose,
}) {
  const [step, setStep] = useState(SELECT_PROTOTYPE);

  const [title, setTitle] = useState(SELECT_PROTOTYPE_LABEL);

  const [selectedType, setSelectedType] = useState(null);

  const handleSubmit = (data) => () => {
    console.log('Click the submit: ', data);
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
              <SettingValues
                protoType={selectedType}
                defaultOrder={defaultOrder}
                handleClose={handleClose}
                propertyField={propertyField}
                handleSubmit={handleSubmit}
              />
            )
          }
        </div>
      </div>
    </CustomModalDialog>
  );
}

AddProperty.propTypes = {
  open: PropTypes.bool.isRequired,
  // isUpdating: PropTypes.bool.isRequired,
  defaultOrder: PropTypes.number.isRequired,
  propertyField: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  // updatePropertyField: PropTypes.func.isRequired,
  // updateDefaultOnCategory: PropTypes.func.isRequired,
  // updateDefaultOnAttriute: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  isUpdating: store.propertyFieldsData.isUpdating,
  propertyField: store.propertyFieldsData.propertyField,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updatePropertyField,
  updateDefaultOnCategory,
  updateDefaultOnAttriute,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddProperty);
