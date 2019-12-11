import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { confirmMessage, isExist } from 'utils';
import { updatePropertyField } from 'redux/actions/propertyFields';
import { CustomInput } from 'components/elements';
import CustomModalDialog from '../../elements/CustomModalDialog';

function AddSelectItems({
  open,
  isUpdating,
  propertyField,
  handleClose,
  selectKey,
  updatePropertyField,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [sectionsData, setSectionsData] = useState({
    key: '',
    label: '',
  });
  const handleChange = (field) => (e) => {
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
      const selectItems = propertyFields.filter((item) => (item.key === selectKey))[0];
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

      if (updateFlag && !isUpdating) {
        updatePropertyField({ propertyFields })
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
    <CustomModalDialog
      title="Add Select Items"
      className="add-selectItems__container"
      handleClose={handleClose}
      open={open}
    >
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
      <span className="add-selectItem-action">
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
      </span>
    </CustomModalDialog>
  );
}

AddSelectItems.propTypes = {
  open: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  selectKey: PropTypes.string.isRequired,
  propertyField: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  isUpdating: store.propertyFieldsData.isUpdating,
  propertyField: store.propertyFieldsData.propertyField,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updatePropertyField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddSelectItems);
