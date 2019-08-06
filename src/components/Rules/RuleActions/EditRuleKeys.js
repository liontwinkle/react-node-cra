import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { ruleTypes, tableIcons } from 'utils/constants';
import { updateCategory } from 'redux/actions/categories';

function EditRuleKeys(props) {
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
        lookup: ruleTypes,
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
          enqueueSnackbar('Rule key has been added successfully.', { variant: 'success', autoHideDuration: 1000 });
          // handleClose();
        })
        .catch(() => {
          enqueueSnackbar('Error in adding rule key.', { variant: 'error', autoHideDuration: 1000 });
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
            enqueueSnackbar('Rule key has been updated successfully.', { variant: 'success', autoHideDuration: 1000 });
            // handleClose();
          })
          .catch(() => {
            enqueueSnackbar('Error in updating rule key.', { variant: 'error', autoHideDuration: 1000 });
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
            enqueueSnackbar('Rule key has been deleted successfully.', { variant: 'success', autoHideDuration: 1000 });
            // handleClose();
          })
          .catch(() => {
            enqueueSnackbar('Error in deleting rule key.', { variant: 'error', autoHideDuration: 1000 });
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

      <DialogContent className="mg-edit-rule-content">
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

EditRuleKeys.propTypes = {
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
)(EditRuleKeys);
