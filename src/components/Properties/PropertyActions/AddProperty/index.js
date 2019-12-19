import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { useSnackbar } from 'notistack';
import isEqual from 'lodash/isEqual';

import CustomModalDialog from 'components/elements/CustomModalDialog';

import { updatePropertyField } from 'redux/actions/propertyFields';
import { updateDefaultOnCategory } from 'redux/actions/categories';
import { updateDefaultOnAttriute } from 'redux/actions/attribute';

import { checkPathValidate, checkTemplate } from 'utils/propertyManagement';
import { confirmMessage, isExist } from 'utils';
import { addNewRuleHistory } from 'utils/ruleManagement';
import SelectProtoType from './seletProtoType';
import SettingValues from './settingValues';

import './style.scss';


const SELECT_PROTOTYPE = 0;
const SETTING_VALUES = 1;

const SELECT_PROTOTYPE_LABEL = 'Select A Type For Your Properties';
const SETTING_VALUES_LABEL = 'Add New Property';

function AddProperty({
  open,
  isUpdating,
  defaultOrder,
  propertyField,
  objectItem,
  handleClose,
  updatePropertyField,
  updateDefaultOnCategory,
  updateDefaultOnAttriute,
  createHistory,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [step, setStep] = useState(SELECT_PROTOTYPE);

  const [title, setTitle] = useState(SELECT_PROTOTYPE_LABEL);

  const [selectedType, setSelectedType] = useState(null);

  const handleSubmit = (data) => () => {
    const savedPropertyFieldData = JSON.parse(JSON.stringify(data.propertyFieldData));
    savedPropertyFieldData.image.name = data.imageName;
    if (!isUpdating) {
      const propertyFields = JSON.parse(JSON.stringify(propertyField.propertyFields));
      const errList = checkTemplate(propertyFields, savedPropertyFieldData);
      const validatePath = checkPathValidate(propertyFields, savedPropertyFieldData);
      if (isExist(propertyFields, savedPropertyFieldData.key) === 0 && errList === '' && validatePath) {
        propertyFields.push({
          ...savedPropertyFieldData,
          propertyType: savedPropertyFieldData.propertyType.key,
          section: savedPropertyFieldData.section && savedPropertyFieldData.section.key,
        });
        const updateDefaultFunc = (objectItem.parent_id !== undefined)
          ? updateDefaultOnCategory : updateDefaultOnAttriute;
        const parentId = (objectItem.parent_id !== undefined) ? objectItem.parent_id : objectItem.group_id;
        if (!isEqual(propertyField.propertyFields, propertyFields)) {
          updatePropertyField({ propertyFields })
            .then(() => {
              updateDefaultFunc(propertyFields)
                .then(() => {
                  addNewRuleHistory(createHistory, objectItem, parentId,
                    `Create Property(${savedPropertyFieldData.propertyType.key})`,
                    `Create Property(${savedPropertyFieldData.propertyType.key}) by ${objectItem.name}`,
                    'virtual');
                  confirmMessage(enqueueSnackbar, 'Property field has been added successfully.', 'success');
                  handleClose();
                })
                .catch(() => {
                  confirmMessage(enqueueSnackbar, 'Error in updating the Properties default value .', 'error');
                });
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, 'Error in adding property field.', 'error');
            });
        } else {
          confirmMessage(enqueueSnackbar, 'The property is duplicated', 'info');
        }
      } else {
        let errMsg = '';
        if (errList !== '') {
          errMsg = `Templating Error: You are try to use unexpected keys. ${errList}`;
        } else if (validatePath) {
          errMsg = `Error: Another property is using the key (${savedPropertyFieldData.key}) you specified.`;
        } else {
          errMsg = 'URL Path is not valid.';
        }
        confirmMessage(enqueueSnackbar, errMsg, 'error');
      }
    }
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
  isUpdating: PropTypes.bool.isRequired,
  defaultOrder: PropTypes.number.isRequired,
  objectItem: PropTypes.object.isRequired,
  propertyField: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
  updateDefaultOnCategory: PropTypes.func.isRequired,
  updateDefaultOnAttriute: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
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
