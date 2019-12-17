import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { confirmMessage, isExist } from 'utils';
import { updatePropertyField } from 'redux/actions/propertyFields';
import { CustomInput } from 'components/elements';
import CustomModalDialog from 'components/elements/CustomModalDialog';

function AddSections({
  open,
  isUpdating,
  defaultOrder,
  propertyField,
  handleClose,
  updatePropertyField,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [sectionsData, setSectionsData] = useState({
    key: '',
    label: '',
    order: defaultOrder,
  });

  const handleChange = (field) => (e) => {
    const newClient = {
      ...sectionsData,
      [field]: e.target.value,
    };
    setSectionsData(newClient);
  };

  const disabled = !(sectionsData.key && sectionsData.label && (sectionsData.order !== ''));

  const handleSubmit = () => {
    if (!isUpdating && !disabled) {
      const { sections } = propertyField;
      if (isExist(sections, sectionsData.key) === 0) {
        sections.push(sectionsData);
        if (!isUpdating) {
          updatePropertyField({ sections })
            .then(() => {
              confirmMessage(enqueueSnackbar, 'Section has been added successfully.', 'success');
              handleClose();
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, 'Error in adding section.', 'error');
            });
        }
      } else {
        const errMsg = `Error: Another section is using the key (${sectionsData.key}) you specified.
         Please update section key name.`;
        confirmMessage(enqueueSnackbar, errMsg, 'error');
      }
    }
  };

  return (
    <CustomModalDialog
      handleClose={handleClose}
      open={open}
      title="Add Section"
      className="add-section-container"
    >
      <>
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
        <CustomInput
          className="mb-3"
          label="Order"
          type="number"
          min={1}
          inline
          value={sectionsData.order}
          onChange={handleChange('order')}
        />
      </>
      <span className="add-section-action">
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

AddSections.propTypes = {
  open: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  defaultOrder: PropTypes.number.isRequired,
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
)(AddSections);
