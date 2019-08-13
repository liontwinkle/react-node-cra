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
import { isExist } from '../../../utils';

function EditSections(props) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    open,
    propertyField,
    updatePorpertyField,
    handleClose,
  } = props;

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

        updatePorpertyField(propertyField.id, { sections })
          .then(() => {
            enqueueSnackbar('Property field has been added successfully.',
              {
                variant: 'success', autoHideDuration: 1000,
              });
          })
          .catch(() => {
            enqueueSnackbar('Error in adding property field.',
              {
                variant: 'error',
                autoHideDuration: 4000,
              });
          });
      } else {
        const errMsg = `Error: Another section is using the key (${newData.key}) you specified.
         Please update section key name.`;
        enqueueSnackbar(errMsg,
          {
            variant: 'error',
            autoHideDuration: 4000,
          });
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

        updatePorpertyField(propertyField.id, { sections })
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

      const ruleKeyIndex = sections.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        sections.splice(ruleKeyIndex, 1);

        updatePorpertyField(propertyField.id, { sections })
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

EditSections.propTypes = {
  open: PropTypes.bool.isRequired,
  propertyField: PropTypes.object.isRequired,
  updatePorpertyField: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  propertyField: store.propertyFieldsData.propertyField,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updatePorpertyField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditSections);
