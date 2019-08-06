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
import { updateCategory } from 'redux/actions/categories';

function EditSections(props) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    open,
    category,
    updateCategory,
    handleClose,
  } = props;

  const { sections } = category;
  const tableData = {
    columns: [
      { title: 'Key', field: 'key' },
      { title: 'Label', field: 'label' },
      { title: 'Order', field: 'order' },
    ],
    data: sections,
  };

  const handleAdd = newData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      sections.push({
        key: newData.key,
        label: newData.label,
        order: newData.order,
      });

      updateCategory(category.id, { sections })
        .then(() => {
          enqueueSnackbar('Property field has been added successfully.',
            {
              variant: 'success', autoHideDuration: 1000,
            });
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

      const ruleKeyIndex = sections.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        sections.splice(ruleKeyIndex, 1, {
          key: newData.key,
          label: newData.label,
          order: newData.order,
          _id: newData._id,
        });

        updateCategory(category.id, { sections })
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
                autoHideDuration: 1000,
              });
          });
      }
    }, 600);
  });

  const handleDelete = oldData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const ruleKeyIndex = sections.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        sections.splice(ruleKeyIndex, 1);

        updateCategory(category.id, { sections })
          .then(() => {
            enqueueSnackbar('Property field has been deleted successfully.',
              {
                variant: 'success',
                autoHideDuration: 1000,
              });
          })
          .catch(() => {
            enqueueSnackbar('Error in deleting property field.',
              {
                variant: 'error',
                autoHideDuration: 1000,
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

EditSections.propTypes = {
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
)(EditSections);
