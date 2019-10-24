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
import { checkTemplate } from 'utils/propertyManagement';
import { updatePropertyField } from 'redux/actions/propertyFields';
import { CustomInput, CustomSelectWithLabel, CustomSearchFilter } from 'components/elements';

function AddPropertyFields({
  open,
  isUpdating,
  handleClose,
  propertyField,
  updatePropertyField,
  createHistory,
  objectItem,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [propertyFieldData, setPropertyFieldData] = useState({
    key: '',
    label: '',
    default: '',
    template: '',
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

  const handleChangeTemplate = field => (value) => {
    const newClient = {
      ...propertyFieldData,
      [field]: value,
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
      const errList = checkTemplate(propertyFields, propertyFieldData);
      if (isExist(propertyFields, propertyFieldData.key) === 0 && errList === '') {
        propertyFields.push({
          ...propertyFieldData,
          propertyType: propertyFieldData.propertyType.key,
          section: propertyFieldData.section && propertyFieldData.section.key,
        });
        if (!isEqual(propertyField.propertyFields, propertyFields)) {
          updatePropertyField({ propertyFields })
            .then(() => {
              addNewRuleHistory(createHistory, objectItem, objectItem.parentId,
                `Create Property(${propertyFieldData.propertyType.key})`,
                `Create Property(${propertyFieldData.propertyType.key}) by ${objectItem.name}`,
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
        const errMsg = (errList !== '')
          ? `Tempalating Error: You are try to use unexpected keys. ${errList}`
          : `Error: Another property is using the key (${propertyFieldData.key}) you specified.
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
        <CustomSelectWithLabel
          className="mb-3"
          label="Type"
          inline
          value={propertyFieldData.propertyType}
          items={propertyFieldTypes}
          onChange={handleChangeType}
        />
        {
          (propertyFieldData.propertyType.key === 'string'
          || propertyFieldData.propertyType.key === 'text'
          || propertyFieldData.propertyType.key === 'richtext'
          || propertyFieldData.propertyType.key === 'monaco')
          && (
            <CustomSearchFilter
              className="mb-3"
              searchItems={propertyField.propertyFields.map(item => (item.key))}
              placeholder="Input search filter"
              label="Template"
              value={propertyFieldData.template}
              onChange={handleChangeTemplate('template')}
            />
          )
        }
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
  objectItem: PropTypes.object.isRequired,
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
