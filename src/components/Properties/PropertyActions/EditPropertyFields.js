import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { isExist, confirmMessage } from 'utils';
import { tableIcons } from 'utils/constants';
import { checkTemplate, getTableData } from 'utils/propertyManagement';
import { addNewRuleHistory } from 'utils/ruleManagement';
import { updatePropertyField } from 'redux/actions/propertyFields';

function EditPropertyFields({
  open,
  propertyField,
  isUpdating,
  updatePropertyField,
  handleClose,
  createHistory,
  objectItem,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const sections = {};
  propertyField.sections.forEach((section) => {
    sections[section.key] = section.label;
  });

  const { propertyFields } = propertyField;
  const tableData = getTableData(sections, propertyFields);

  const handleAdd = newData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      const errList = checkTemplate(propertyFields, newData);
      if (isExist(propertyFields, newData.key) === 0 && errList === '') {
        propertyFields.push({
          key: newData.key,
          label: newData.label,
          default: newData.default,
          template: newData.template,
          propertyType: newData.propertyType,
          section: newData.section,
          order: newData.order,
        });
        if (!isUpdating) {
          updatePropertyField({ propertyFields })
            .then(() => {
              addNewRuleHistory(createHistory, objectItem, objectItem.groupId,
                `Create Property(${newData.propertyType})`,
                `Create Property(${newData.propertyType}) by ${objectItem.name}`,
                'virtual');
              confirmMessage(enqueueSnackbar, 'Property field has been added successfully.', 'success');
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, 'Error in adding property field.', 'error');
            });
        }
      } else {
        const errMsg = (errList !== '')
          ? `Tempalating Error: You are try to use unexpected keys. ${errList}`
          : `Error: Another property is using the key (${newData.key}) you specified.
         Please update property key name.`;
        confirmMessage(enqueueSnackbar, errMsg, 'error');
      }
    }, 600);
  });

  const handleUpdate = (newData, oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const data = JSON.parse(JSON.stringify(oldData));
      const ruleKeyIndex = propertyFields.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        propertyFields.splice(ruleKeyIndex, 1, {
          key: newData.key,
          label: newData.label,
          default: newData.default,
          template: newData.template,
          propertyType: newData.propertyType,
          section: newData.section,
          order: newData.order,
          _id: newData._id,
        });
        delete data.tableData;
        if (JSON.stringify(newData) !== JSON.stringify(data)) {
          const errList = checkTemplate(propertyFields, newData);
          if (!isUpdating && isExist(propertyFields, newData.key) === 1 && errList === '') {
            updatePropertyField({ propertyFields })
              .then(() => {
                addNewRuleHistory(createHistory, objectItem, objectItem.groupId,
                  `Update the Property field(${newData.label} ${newData.propertyType})`,
                  `Update the Property field(${newData.label} ${newData.propertyType}) by ${objectItem.name}`,
                  'virtual');
                confirmMessage(enqueueSnackbar, 'Property field has been updated successfully.', 'success');
              })
              .catch(() => {
                confirmMessage(enqueueSnackbar, 'Error in updating property field.', 'error');
              });
          } else {
            const errMsg = `Templating Error: You are try to use unexpected keys. ${errList}`;
            confirmMessage(enqueueSnackbar, errMsg, 'error');
          }
        } else {
          confirmMessage(enqueueSnackbar, 'There is no any update.', 'info');
        }
      }
    }, 600);
  });

  const handleDelete = oldData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const ruleKeyIndex = propertyFields.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        propertyFields.splice(ruleKeyIndex, 1);
        if (!isUpdating) {
          updatePropertyField({ propertyFields })
            .then(() => {
              addNewRuleHistory(createHistory, objectItem, objectItem.groupId,
                `Delete the property field (${oldData.label})`,
                `Delete the property field (${oldData.label}) by ${objectItem.name}`,
                'virtual');
              confirmMessage(enqueueSnackbar, 'Property field has been deleted successfully.', 'success');
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, 'Error in deleting property field.', 'error');
            });
        }
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

      <DialogContent className="mg-edit-properties-content field">
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
            pageSize: 20,
            pageSizeOptions: [10, 20],
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
  isUpdating: PropTypes.bool.isRequired,
  objectItem: PropTypes.object.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  propertyField: store.propertyFieldsData.propertyField,
  isUpdating: store.propertyFieldsData.isUpdating,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updatePropertyField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPropertyFields);
