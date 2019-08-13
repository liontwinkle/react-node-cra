import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { tableIcons } from 'utils/constants';
import { updatePorpertyField } from 'redux/actions/propertyFields';
import { updateCategory } from 'redux/actions/categories';
import { isExist } from '../../../utils';

function EditPropertyFields(props) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    open,
    propertyField,
    updatePorpertyField,
    updateCategory,
    category,
    handleClose,
    selectKey,
  } = props;

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
      ? propertyFields.filter(item => (item.key === selectKey))[0].items : [],
  };


  const handleAdd = newData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      const selectItems = propertyFields.filter(item => (item.key === selectKey))[0];
      let updateFlag = true;
      if (selectItems.items) {
        if (isExist(selectItems.items, newData.key) === 0) {
          selectItems.items.push({
            key: newData.key,
            label: newData.label,
          });
        } else {
          updateFlag = false;
          const errMsg = `Error: Another item is using the key (${newData.key})
           you specified.Please update item key name.`;
          enqueueSnackbar(errMsg,
            {
              variant: 'error',
              autoHideDuration: 4000,
            });
        }
      } else {
        selectItems.items = {
          key: newData.key,
          label: newData.label,
        };
      }

      if (updateFlag) {
        updatePorpertyField(propertyField.id, { propertyFields })
          .then(() => {
            enqueueSnackbar('Item has been added successfully.',
              {
                variant: 'success',
                autoHideDuration: 1500,
              });
            handleClose();
          })
          .catch(() => {
            enqueueSnackbar('Error in adding Item.',
              {
                variant: 'error',
                autoHideDuration: 4000,
              });
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

        updatePorpertyField(propertyField.id, { propertyFields })
          .then(() => {
            enqueueSnackbar('Property field has been updated successfully.',
              {
                variant: 'success',
                autoHideDuration: 1000,
              });
          })
          .catch(() => {
            enqueueSnackbar('Error in updating property field.',
              {
                variant: 'error',
                autoHideDuration: 4000,
              });
          });
      }
    }, 600);
  });

  const handleDelete = oldData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      const selectItems = propertyFields.filter(item => (item.key === selectKey))[0].items;
      const ruleKeyIndex = selectItems.findIndex(rk => rk._id === oldData._id);
      if (properties[selectKey] === oldData.key) properties[selectKey] = '';
      if (ruleKeyIndex > -1) {
        selectItems.splice(ruleKeyIndex, 1);
        updatePorpertyField(propertyField.id, { propertyFields })
          .then(() => {
            updateCategory(category.id, { properties })
              .then(() => {
                enqueueSnackbar('Selected item has been deleted successfully.',
                  {
                    variant: 'success',
                    autoHideDuration: 1500,
                  });
              })
              .catch(() => {
                enqueueSnackbar('Error in deleting Property.',
                  {
                    variant: 'error',
                    autoHideDuration: 4000,
                  });
              });
          })
          .catch(() => {
            enqueueSnackbar('Error in deleting property field.',
              {
                variant: 'error',
                autoHideDuration: 4000,
              });
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
  updatePorpertyField: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  selectKey: PropTypes.string.isRequired,
};

const mapStateToProps = store => ({
  propertyField: store.propertyFieldsData.propertyField,
  category: store.categoriesData.category,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updatePorpertyField,
  updateCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPropertyFields);
