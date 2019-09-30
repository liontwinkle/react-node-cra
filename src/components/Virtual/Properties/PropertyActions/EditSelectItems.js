import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { confirmMessage, isExist } from 'utils';
import { tableIcons } from 'utils/constants';
import { updatePropertyField } from 'redux/actions/propertyFields';
import { updateCategory } from 'redux/actions/categories';

function EditPropertyFields({
  open,
  propertyField,
  updatePropertyField,
  updateCategory,
  category,
  handleClose,
  selectKey,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const sections = {};
  propertyField.sections.forEach((section) => {
    sections[section.key] = section.label;
  });

  const { propertyFields } = propertyField;
  const { properties } = category;
  const tableData = {
    columns: [
      { title: 'Key', field: 'key' },
      { title: 'Label', field: 'label' },
    ],
    data: (propertyFields.filter(item => (item.key === selectKey)).length > 0)
      ? propertyFields.filter(item => (item.key === selectKey))[0].items
      : [],
  };

  const handleAdd = newData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const selectItems = propertyFields.filter(item => (item.key === selectKey))[0];
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
    }, 600);
  });

  const handleUpdate = (newData, oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const selectItems = propertyFields.filter(item => (item.key === selectKey))[0].items;
      const ruleKeyIndex = selectItems.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        selectItems.splice(ruleKeyIndex, 1, {
          key: newData.key,
          label: newData.label,
          _id: newData._id,
        });

        updatePropertyField(propertyField.id, { propertyFields })
          .then(() => {
            confirmMessage(enqueueSnackbar, 'Property field has been updated successfully.', 'success');
          })
          .catch(() => {
            confirmMessage(enqueueSnackbar, 'Error in updating property field.', 'error');
          });
      }
    }, 600);
  });

  const handleDelete = oldData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const selectItems = propertyFields.filter(item => (item.key === selectKey))[0].items;
      const ruleKeyIndex = selectItems.findIndex(rk => rk._id === oldData._id);

      if (properties[selectKey] === oldData.key) {
        properties[selectKey] = '';
      }

      if (ruleKeyIndex > -1) {
        selectItems.splice(ruleKeyIndex, 1);
        updatePropertyField(propertyField.id, { propertyFields })
          .then(() => {
            updateCategory(category.id, { properties })
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
    }, 600);
  });

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Edit Property Fields
      </DialogTitle>

      <DialogContent className="mg-edit-properties-content">
        <MaterialTable
          title=""
          icons={tableIcons}
          columns={tableData.columns}
          data={tableData.data}
          editable={{
            onRowAdd: handleAdd,
            onRowUpdate: handleUpdate,
            onRowDelete: handleDelete,
          }}
          options={{
            actionsColumnIndex: -1,
            showTitle: false,
            searchFieldAlignment: 'left',
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

EditPropertyFields.propTypes = {
  open: PropTypes.bool.isRequired,
  propertyField: PropTypes.object.isRequired,
  category: PropTypes.object.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectKey: PropTypes.string.isRequired,
};

const mapStateToProps = store => ({
  propertyField: store.propertyFieldsData.propertyField,
  category: store.categoriesData.category,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updatePropertyField,
  updateCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPropertyFields);
