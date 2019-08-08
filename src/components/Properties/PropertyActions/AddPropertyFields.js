import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';

import { propertyFieldTypes } from 'utils/constants';
import { CustomInput, CustomSelectWithLabel } from 'components/elements';
import { isExist } from 'utils';
import { updatePorpertyField } from '../../../redux/actions/propertyFields';

const useStyles = makeStyles(theme => ({
  dialogAction: {
    margin: theme.spacing(2),
  },
  dialogContent: {
    overflow: 'unset',
  },
}));

function AddPropertyFields(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const {
    open,
    isUpdating,
    handleClose,
    propertyField,
    updatePorpertyField,
  } = props;

  const [propertyFieldData, setPropertyFieldData] = useState({
    key: '',
    label: '',
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

        updatePorpertyField(propertyField.id, { propertyFields })
          .then(() => {
            enqueueSnackbar('Property field has been added successfully.',
              {
                variant: 'success', autoHideDuration: 1000,
              });
            handleClose();
          })
          .catch(() => {
            enqueueSnackbar('Error in adding property field.',
              {
                variant: 'error', autoHideDuration: 1500,
              });
          });
      } else {
        enqueueSnackbar('The same key is existed.',
          {
            variant: 'error', autoHideDuration: 1500,
          });
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
  updatePorpertyField: PropTypes.func.isRequired,
  propertyField: PropTypes.object.isRequired,
};

const mapStateToProps = store => ({
  isUpdating: store.propertyFieldsData.isUpdating,
  propertyField: store.propertyFieldsData.propertyField,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updatePorpertyField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddPropertyFields);
