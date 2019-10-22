import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { useSnackbar } from 'notistack';
import isEqual from 'lodash/isEqual';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
} from '@material-ui/core';

import { confirmMessage, isExist, useStyles } from 'utils';
import { propertyFieldTypes } from 'utils/constants';
import { addNewRuleHistory } from 'utils/ruleManagement';
import { updatePropertyField } from 'redux/actions/propertyFields';
import { CustomInput, CustomSelectWithLabel, CustomToggle } from 'components/elements';

function AddPropertyFields({
  open,
  isUpdating,
  handleClose,
  propertyField,
  updatePropertyField,
  createHistory,
  category,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [propertyFieldData, setPropertyFieldData] = useState({
    key: '',
    label: '',
    default: '',
    template: false,
    propertyType: { key: 'string', label: 'String' },
    section: null,
  });

  const handleChange = field => (e) => {
    const newClient = {
      ...propertyFieldData,
      [field]: e.target.value,
    };
    setPropertyFieldData(newClient);
  };

  const handleChangeTemplate = field => () => {
    const newClient = {
      ...propertyFieldData,
      [field]: !propertyFieldData[field],
    };
    setPropertyFieldData(newClient);
  };

  const handleChangeType = (propertyType) => {
    const newClient = {
      ...propertyFieldData,
      propertyType,
    };
    setPropertyFieldData(newClient);
  };

  const handleChangeSection = (section) => {
    const newClient = {
      ...propertyFieldData,
      section,
    };
    setPropertyFieldData(newClient);
  };

  const disabled = !(propertyFieldData.key && propertyFieldData.label && propertyFieldData.propertyType);

  const handleSubmit = () => {
    if (!isUpdating && !disabled) {
      const propertyFields = JSON.parse(JSON.stringify(propertyField.propertyFields));
      if (isExist(propertyFields, propertyFieldData.key) === 0) {
        propertyFields.push({
          ...propertyFieldData,
          propertyType: propertyFieldData.propertyType.key,
          section: propertyFieldData.section && propertyFieldData.section.key,
        });
        if (!isEqual(propertyField.propertyFields, propertyFields)) {
          updatePropertyField({ propertyFields })
            .then(() => {
              addNewRuleHistory(createHistory, category, category.parentId,
                `Create Property(${propertyFieldData.propertyType.key})`,
                `Create Property(${propertyFieldData.propertyType.key}) by ${category.name}`,
                'virtual');
              confirmMessage(enqueueSnackbar, 'Property field has been added successfully.', 'success');
              handleClose();
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, 'Error in adding property field.', 'error');
            });
        } else {
          confirmMessage(enqueueSnackbar, 'The property is duplicated', 'info');
        }
      } else {
        const errMsg = `Error: Another property is using the key (${propertyFieldData.key}) you specified.
         Please update property key name.`;
        confirmMessage(enqueueSnackbar, errMsg, 'error');
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Add Property Fields
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <CustomInput
          className="mb-3"
          label="Key"
          inline
          value={propertyFieldData.key}
          onChange={handleChange('key')}
        />
        <CustomInput
          className="mb-3"
          label="Label"
          inline
          value={propertyFieldData.label}
          onChange={handleChange('label')}
        />
        <CustomInput
          className="mb-3"
          label="Default"
          inline
          value={propertyFieldData.default}
          onChange={handleChange('default')}
        />
        <CustomToggle
          className="mb-3"
          label="Template"
          inline
          value={propertyFieldData.template}
          onToggle={handleChangeTemplate('template')}
        />
        <CustomSelectWithLabel
          className="mb-3"
          label="Type"
          inline
          value={propertyFieldData.propertyType}
          items={propertyFieldTypes}
          onChange={handleChangeType}
        />
        <CustomSelectWithLabel
          label="Section"
          inline
          value={propertyFieldData.section}
          items={propertyField.sections}
          onChange={handleChangeSection}
        />
      </DialogContent>

      <DialogActions className={classes.dialogAction}>
        <button
          className="mg-button secondary"
          disabled={isUpdating}
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          className="mg-button primary"
          disabled={isUpdating || disabled}
          onClick={handleSubmit}
        >
          Save
        </button>
      </DialogActions>
    </Dialog>
  );
}

AddPropertyFields.propTypes = {
  open: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  propertyField: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  isUpdating: store.propertyFieldsData.isUpdating,
  propertyField: store.propertyFieldsData.propertyField,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updatePropertyField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddPropertyFields);
