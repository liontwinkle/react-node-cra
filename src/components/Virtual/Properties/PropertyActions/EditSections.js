import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { confirmMessage, isExist } from 'utils/index';
import { tableIcons } from 'utils/constants';
import { updatePropertyField } from 'redux/actions/propertyFields';

function EditSections({
  open,
  propertyField,
  updatePropertyField,
  handleClose,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const { sections } = propertyField;
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

      if (isExist(sections, newData.key) === 0) {
        sections.push({
          key: newData.key,
          label: newData.label,
          order: newData.order,
        });

        updatePropertyField(propertyField.id, { sections })
          .then(() => {
            confirmMessage(enqueueSnackbar, 'Property field has been added successfully.', 'success');
          })
          .catch(() => {
            confirmMessage(enqueueSnackbar, 'Error in adding property field.', 'error');
          });
      } else {
        const errMsg = `Error: Another section is using the key (${newData.key}) you specified.
         Please update section key name.`;
        confirmMessage(enqueueSnackbar, errMsg, 'error');
      }
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

        updatePropertyField(propertyField.id, { sections })
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

      const ruleKeyIndex = sections.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        sections.splice(ruleKeyIndex, 1);

        updatePropertyField(propertyField.id, { sections })
          .then(() => {
            confirmMessage(enqueueSnackbar, 'Property field has been deleted successfully.', 'success');
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

EditSections.propTypes = {
  open: PropTypes.bool.isRequired,
  propertyField: PropTypes.object.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  propertyField: store.propertyFieldsData.propertyField,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updatePropertyField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditSections);
