import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import CustomMaterialTableModal from 'components/elements/CustomMaterialTableModal';

import { confirmMessage, isExist } from 'utils';
import { updatePropertyField } from 'redux/actions/propertyFields';

function EditPropertyFields({
  open,
  propertyField,
  isUpdating,
  updatePropertyField,
  updateObject,
  objectItem,
  handleClose,
  selectKey,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const sections = {};
  propertyField.sections.forEach((section) => {
    sections[section.key] = section.label;
  });

  const { propertyFields } = propertyField;
  const properties = objectItem.properties || {};
  const tableData = {
    columns: [
      { title: 'Key', field: 'key' },
      { title: 'Label', field: 'label' },
    ],
    data: (propertyFields.filter((item) => (item.key === selectKey)).length > 0)
      ? propertyFields.filter((item) => (item.key === selectKey))[0].items
      : [],
  };

  const handleAdd = (newData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const selectItems = propertyFields.filter((item) => (item.key === selectKey))[0];
      let updateFlag = true;
      if (selectItems.items) {
        if (isExist(selectItems.items, newData.key) === 0) {
          selectItems.items.push({ key: newData.key, label: newData.label });
        } else {
          updateFlag = false;
          const errMsg = `Error: Another item is using the key (${newData.key})
           you specified.Please update item key name.`;
          confirmMessage(enqueueSnackbar, errMsg, 'error');
        }
      } else {
        selectItems.items = { key: newData.key, label: newData.label };
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
    }, 600);
  });

  const handleUpdate = (newData, oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const selectItems = propertyFields.filter((item) => (item.key === selectKey))[0].items;
      const ruleKeyIndex = selectItems.findIndex((rk) => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        selectItems.splice(ruleKeyIndex, 1, {
          key: newData.key,
          label: newData.label,
          _id: newData._id,
        });

        if (!isUpdating) {
          updatePropertyField({ propertyFields })
            .then(() => {
              confirmMessage(enqueueSnackbar, 'Property field has been updated successfully.', 'success');
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, 'Error in updating property field.', 'error');
            });
        }
      }
    }, 600);
  });

  const handleDelete = (oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const selectItems = propertyFields.filter((item) => (item.key === selectKey))[0].items;
      const ruleKeyIndex = selectItems.findIndex((rk) => rk._id === oldData._id);
      if (properties[selectKey] && properties[selectKey] === oldData.key) {
        properties[selectKey] = '';
      }

      if (ruleKeyIndex > -1) {
        selectItems.splice(ruleKeyIndex, 1);

        if (!isUpdating) {
          updatePropertyField({ propertyFields })
            .then(() => {
              updateObject(objectItem._id, { properties })
                .then(() => {
                  confirmMessage(enqueueSnackbar, 'Selected item has been deleted successfully.', 'success');
                })
                .catch(() => {
                  confirmMessage(enqueueSnackbar, 'Error in deleting Property.', 'error');
                });
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, 'Error in deleting property field.', 'error');
            });
        }
      }
    }, 600);
  });

  return (
    <CustomMaterialTableModal
      open={open}
      className="mg-edit-properties-content"
      title="Edit Select Items"
      tableData={tableData}
      handleClose={handleClose}
      handleAdd={handleAdd}
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
      options={{
        actionsColumnIndex: -1,
        showTitle: false,
        searchFieldAlignment: 'left',
      }}
    />
  );
}

EditPropertyFields.propTypes = {
  open: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  selectKey: PropTypes.string.isRequired,
  propertyField: PropTypes.object.isRequired,
  objectItem: PropTypes.object.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
  updateObject: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  propertyField: store.propertyFieldsData.propertyField,
  isUpdating: store.propertyFieldsData.isUpdating,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updatePropertyField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPropertyFields);
