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

function EditPropertyFields(props) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    open,
    category,
    updateCategory,
    handleClose,
  } = props;

  const { ruleKeys } = category;
  const tableData = {
    columns: [
      { title: 'Key', field: 'key' },
      { title: 'Label', field: 'label' },
      {
        title: 'Type',
        field: 'ruleType',
        lookup: { string: 'String', number: 'Number' },
      },
    ],
    data: ruleKeys,
  };

  const handleAdd = newData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      ruleKeys.push({
        key: newData.key,
        label: newData.label,
        ruleType: newData.ruleType,
      });

      updateCategory(category.id, { ruleKeys })
        .then(() => {
          enqueueSnackbar('Rule keys has been added successfully.', { variant: 'success' });
          // handleClose();
        })
        .catch(() => {
          enqueueSnackbar('Error in adding rule keys.', { variant: 'error' });
        });
    }, 600);
  });

  const handleUpdate = (newData, oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const ruleKeyIndex = ruleKeys.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        ruleKeys.splice(ruleKeyIndex, 1, {
          key: newData.key,
          label: newData.label,
          ruleType: newData.ruleType,
          _id: newData._id,
        });

        updateCategory(category.id, { ruleKeys })
          .then(() => {
            enqueueSnackbar('Rule keys has been updated successfully.', { variant: 'success' });
            // handleClose();
          })
          .catch(() => {
            enqueueSnackbar('Error in updating rule keys.', { variant: 'error' });
          });
      }
    }, 600);
  });

  const handleDelete = oldData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const ruleKeyIndex = ruleKeys.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        ruleKeys.splice(ruleKeyIndex, 1);

        updateCategory(category.id, { ruleKeys })
          .then(() => {
            enqueueSnackbar('Rule keys has been deleted successfully.', { variant: 'success' });
            // handleClose();
          })
          .catch(() => {
            enqueueSnackbar('Error in deleting property fields.', { variant: 'error' });
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
        Edit Rule Keys
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
  category: PropTypes.object,
  updateCategory: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

EditPropertyFields.defaultProps = {
  category: null,
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