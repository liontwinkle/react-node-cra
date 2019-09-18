import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';

import { confirmMessage, isExist } from 'utils/index';
import { updatePropertyField } from 'redux/actions/propertyFields';
import { propertyFieldTypes } from 'utils/constants';
import { CustomInput, CustomSelectWithLabel } from 'components/elements/index';

const useStyles = makeStyles(theme => ({
  dialogAction: {
    margin: theme.spacing(2),
  },
  dialogContent: {
    overflow: 'unset',
  },
}));

function AddPropertyFields({
  open,
  isUpdating,
  handleClose,
  propertyField,
  updatePropertyField,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [propertyFieldData, setPropertyFieldData] = useState({
    key: '',
    label: '',
    default: '',
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
      const { propertyFields } = propertyField;
      if (isExist(propertyFields, propertyFieldData.key) === 0) {
        propertyFields.push({
          ...propertyFieldData,
          propertyType: propertyFieldData.propertyType.key,
          section: propertyFieldData.section && propertyFieldData.section.key,
        });

        updatePropertyField(propertyField.id, { propertyFields })
          .then(() => {
            confirmMessage(enqueueSnackbar, 'Property field has been added successfully.', 'success');
            handleClose();
          })
          .catch(() => {
            confirmMessage(enqueueSnackbar, 'Error in adding property field.', 'error');
          });
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
  handleClose: PropTypes.func.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
  propertyField: PropTypes.object.isRequired,
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
