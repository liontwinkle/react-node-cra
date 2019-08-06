import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { propertyTypes, tableIcons } from 'utils/constants';
import { updateCategory } from 'redux/actions/categories';

function EditPropertyFields(props) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    open,
    category,
    updateCategory,
    handleClose,
  } = props;

  const sections = {};
  category.sections.forEach((section) => {
    sections[section.key] = section.label;
  });

  const { propertyFields } = category;
  const tableData = {
    columns: [
      { title: 'Key', field: 'key' },
      { title: 'Label', field: 'label' },
      {
        title: 'Type',
        field: 'propertyType',
        lookup: propertyTypes,
      },
      {
        title: 'Section',
        field: 'section',
        lookup: sections,
      },
    ],
    data: propertyFields,
  };

  const handleAdd = newData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      propertyFields.push({
        key: newData.key,
        label: newData.label,
        propertyType: newData.propertyType,
        section: newData.section,
      });

      updateCategory(category.id, { propertyFields })
        .then(() => {
          enqueueSnackbar('Property field has been added successfully.',
            {
              variant: 'success', autoHideDuration: 1000,
            });
          // handleClose();
        })
        .catch(() => {
          enqueueSnackbar('Error in adding property field.',
            {
              variant: 'error', autoHideDuration: 1000,
            });
        });
    }, 600);
  });

  const handleUpdate = (newData, oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const ruleKeyIndex = propertyFields.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        propertyFields.splice(ruleKeyIndex, 1, {
          key: newData.key,
          label: newData.label,
          propertyType: newData.propertyType,
          section: newData.section,
          _id: newData._id,
        });

        updateCategory(category.id, { propertyFields })
          .then(() => {
            enqueueSnackbar('Property field has been updated successfully.',
              {
                variant: 'success', autoHideDuration: 1000,
              });
            // handleClose();
          })
          .catch(() => {
            enqueueSnackbar('Error in updating property field.', { variant: 'error', autoHideDuration: 1000 });
          });
      }
    }, 600);
  });

  const handleDelete = oldData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const ruleKeyIndex = propertyFields.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        propertyFields.splice(ruleKeyIndex, 1);

        updateCategory(category.id, { propertyFields })
          .then(() => {
            enqueueSnackbar('Property field has been deleted successfully.',
              {
                variant: 'success', autoHideDuration: 1000,
              });
            // handleClose();
          })
          .catch(() => {
            enqueueSnackbar('Error in deleting property field.',
              {
                variant: 'error', autoHideDuration: 1000,
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
  category: PropTypes.object.isRequired,
  updateCategory: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  category: store.categoriesData.category,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPropertyFields);
