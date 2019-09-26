import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import { confirmMessage, isExist, useStyles } from 'utils';
import { updatePropertyField } from 'redux/actions/propertyFields';
import { CustomInput } from 'components/elements';

function AddSelectItems({
  open,
  isUpdating,
  propertyField,
  handleClose,
  selectKey,
  updatePropertyField,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [sectionsData, setSectionsData] = useState({
    key: '',
    label: '',
  });
  const handleChange = field => (e) => {
    const newClient = {
      ...sectionsData,
      [field]: e.target.value,
    };
    setSectionsData(newClient);
  };

  const disabled = !(sectionsData.key && sectionsData.label);

  const handleSubmit = () => {
    if (!isUpdating && !disabled) {
      const { propertyFields } = propertyField;
      const selectItems = propertyFields.filter(item => (item.key === selectKey))[0];
      let updateFlag = true;

      if (selectItems.items) {
        if (isExist(selectItems.items, sectionsData.key) === 0) {
          selectItems.items.push(sectionsData);
        } else {
          updateFlag = false;
          const errMsg = `Error: Another item is using the key (${sectionsData.key})
           you specified.Please update item key name.`;
          confirmMessage(enqueueSnackbar, errMsg, 'error');
        }
      } else {
        selectItems.items = sectionsData;
      }

      if (updateFlag) {
        updatePropertyField(propertyField.id, { propertyFields })
          .then(() => {
            confirmMessage(enqueueSnackbar, 'Item has been added successfully.', 'success');
            handleClose();
          })
          .catch(() => {
            confirmMessage(enqueueSnackbar, 'Error in adding Item.', 'error');
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
        Add Select Items
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <CustomInput
          className="mb-3"
          label="Key"
          inline
          value={sectionsData.key}
          onChange={handleChange('key')}
        />
        <CustomInput
          className="mb-3"
          label="Label"
          inline
          value={sectionsData.label}
          onChange={handleChange('label')}
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

AddSelectItems.propTypes = {
  open: PropTypes.bool.isRequired,
  selectKey: PropTypes.string.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  propertyField: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
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
)(AddSelectItems);
