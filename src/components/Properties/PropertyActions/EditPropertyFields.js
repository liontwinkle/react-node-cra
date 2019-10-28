import React, { useState } from 'react';
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
import { checkPathValidate, checkTemplate, getTableData } from 'utils/propertyManagement';
import { addNewRuleHistory } from 'utils/ruleManagement';
import { updatePropertyField } from 'redux/actions/propertyFields';
import { CustomConfirmDlg } from 'components/elements';

function EditPropertyFields({
  open,
  order,
  pageNum,
  objectItem,
  propertyField,
  isUpdating,
  updatePropertyField,
  handleClose,
  createHistory,
  onChangeOrder,
  onChangePageNum,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [changeType, setChangeType] = useState(false);
  const [updatedProperties, setUpdatedProperties] = useState(null);
  const [updatedNewData, setUpdatedNewData] = useState(null);
  const [updatedOldData, setUpdatedOldData] = useState(null);
  const sections = {};
  propertyField.sections.forEach((section) => {
    sections[section.key] = section.label;
  });

  const { propertyFields } = propertyField;
  const tableData = getTableData(sections, propertyFields, order);
  const handleAdd = newData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      const errList = checkTemplate(propertyFields, newData);
      const validatePath = checkPathValidate(propertyFields, newData);
      if (isExist(propertyFields, newData.key) === 0 && errList === '' && validatePath) {
        propertyFields.push({
          key: newData.key,
          label: newData.label,
          default: newData.default,
          template: newData.template,
          propertyType: newData.propertyType,
          section: newData.section,
          order: newData.order,
          items: newData.items,
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
        let errMsg = '';
        if (errList !== '') {
          errMsg = `Templating Error: You are try to use unexpected keys. ${errList}`;
        } else if (validatePath) {
          errMsg = 'URL Path is not valid.';
        } else {
          errMsg = `Error: Another property is using the key (${newData.key}) you specified.
         Please update property key name.`;
        }
        confirmMessage(enqueueSnackbar, errMsg, 'error');
      }
    }, 600);
  });

  const confirmDlgClose = () => {
    setChangeType(false);
  };

  const updateAction = (data, newData) => {
    const validatePath = checkPathValidate(propertyFields, newData);
    if (validatePath) {
      updatePropertyField({ propertyFields: data })
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
      confirmMessage(enqueueSnackbar, 'URL Path is not correct.', 'error');
    }
  };

  const handleUpdateType = () => {
    const changedProperties = JSON.parse(JSON.stringify(updatedProperties));
    const oldKey = updatedOldData.key;
    updatedProperties.forEach((item, index) => {
      const reg = new RegExp(`\\$${oldKey}`);
      if (item.default) {
        changedProperties[index].default = item.default.replace(reg, '');
      }
      if (item.template) {
        changedProperties[index].template = item.template.replace(reg, '');
      }
    });
    updateAction(changedProperties, updatedNewData);
    setChangeType(false);
  };

  const checkUsageOldKey = (newData, oldData) => {
    let result = false;
    if (newData.propertyType !== oldData.propertyType) {
      if (
        newData.propertyType !== 'string'
        && newData.propertyType !== 'text'
        && newData.propertyType !== 'monaco'
        && newData.propertyType !== 'richtext'
        && newData.propertyType !== 'urlpath'
      ) {
        propertyFields.forEach((item) => {
          const reg = new RegExp(`\\$${oldData.key}`);
          if (reg.test(item.default) || reg.test(item.template)) {
            result = true;
          }
        });
      }
    }
    return result;
  };

  const changeKey = (newData, oldData, fields) => {
    const oldKey = oldData.key;
    const newKey = newData.key;
    const changedFields = JSON.parse(JSON.stringify(fields));
    if (oldKey !== newKey) {
      fields.forEach((item, index) => {
        const reg = new RegExp(`\\$${oldKey}`);
        if (item.default) {
          changedFields[index].default = item.default.replace(reg, `$${newKey}`);
        }
        if (item.template) {
          changedFields[index].template = item.template.replace(reg, `$${newKey}`);
        }
      });
    }
    return changedFields;
  };
  const handleUpdate = (newData, oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      const data = JSON.parse(JSON.stringify(oldData));
      const sendData = JSON.parse(JSON.stringify(propertyFields));
      const ruleKeyIndex = sendData.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        sendData.splice(ruleKeyIndex, 1, {
          key: newData.key,
          label: newData.label,
          default: newData.default,
          template: newData.template,
          propertyType: newData.propertyType,
          section: newData.section,
          order: newData.order,
          items: newData.items,
          _id: newData._id,
        });
        delete data.tableData;
        if (JSON.stringify(newData) !== JSON.stringify(data)) {
          const errList = checkTemplate(sendData, newData);
          if (!isUpdating && isExist(sendData, newData.key) === 1 && errList === '') {
            setUpdatedProperties(sendData);
            setUpdatedNewData(newData);
            setUpdatedOldData(oldData);
            if (checkUsageOldKey(newData, oldData)) {
              setChangeType(true);
            } else {
              setChangeType(false);
              updateAction(changeKey(newData, oldData, sendData), newData);
            }
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
          onOrderChange={onChangeOrder}
          onChangeRowsPerPage={onChangePageNum}
          options={{
            pageSize: pageNum,
            pageSizeOptions: [10, 20],
            actionsColumnIndex: -1,
            showTitle: false,
            searchFieldAlignment: 'left',
          }}
        />
      </DialogContent>
      {
        changeType
        && (
          <CustomConfirmDlg
            open={changeType}
            msg="Do you change the type of the property?"
            confirmLabel="Update"
            handleDelete={handleUpdateType}
            handleClose={confirmDlgClose}
          />
        )
      }
    </Dialog>
  );
}

EditPropertyFields.propTypes = {
  open: PropTypes.bool.isRequired,
  propertyField: PropTypes.object.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  objectItem: PropTypes.object.isRequired,
  order: PropTypes.object.isRequired,
  pageNum: PropTypes.number.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  onChangeOrder: PropTypes.func.isRequired,
  onChangePageNum: PropTypes.func.isRequired,
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
