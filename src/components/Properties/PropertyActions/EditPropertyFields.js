import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { CustomConfirmDlg } from 'components/elements';
import CustomMaterialTableModal from 'components/elements/CustomMaterialTableModal';
import {
  isExist, confirmMessage, convertString, getMaxValueFromArray,
} from 'utils';
import { checkPathValidate, checkTemplate, getTableData } from 'utils/propertyManagement';
import { addNewRuleHistory } from 'utils/ruleManagement';
import { updatePropertyField } from 'redux/actions/propertyFields';
import { updateDefaultOnCategory } from 'redux/actions/categories';
import { updateDefaultOnAttriute } from 'redux/actions/attribute';

function EditPropertyFields({
  open,
  order,
  pageNum,
  objectItem,
  propertyField,
  isUpdating,
  updatePropertyField,
  updateDefaultOnCategory,
  updateDefaultOnAttriute,
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
  const updateDefaultFunc = (objectItem.parent_id !== undefined)
    ? updateDefaultOnCategory : updateDefaultOnAttriute;
  const parentId = (objectItem.group_id) ? objectItem.group_id : objectItem.parent_id;
  propertyField.sections.forEach((section) => {
    sections[section.key] = section.label;
  });

  const { propertyFields } = propertyField;
  const tableData = getTableData(sections, propertyFields, order);

  const validate = (data) => {
    let validation = true;
    const updatedData = JSON.parse(JSON.stringify(data));
    let confirmMsg = '';
    if (!data.key) {
      validation = false;
      confirmMsg = 'The key of data could not set as Empty or Null.';
    } else if (!data.label) {
      validation = false;
      confirmMsg = 'The label of data could not set as Empty or Null.';
    } else if (!data.propertyType) {
      validation = false;
      confirmMsg = 'The Type of data should be selected.';
    } else if (!data.order) {
      const order = parseInt(getMaxValueFromArray('order', propertyFields), 10) + 1;
      updatedData.order = order;
      confirmMsg = `The Order is set as ${order}.`;
      confirmMessage(enqueueSnackbar, confirmMsg, 'info');
    }
    if (!validation) { confirmMessage(enqueueSnackbar, confirmMsg, 'error'); }
    return {
      validation,
      updatedData,
    };
  };

  const handleAdd = (newData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      const validateResult = validate(newData);
      const data = validateResult.updatedData;
      if (validateResult.validation) {
        const errList = checkTemplate(propertyFields, data);
        const validatePath = checkPathValidate(propertyFields, data);
        if (isExist(propertyFields, data.key) === 0 && errList === '' && validatePath) {
          propertyFields.push({
            key: data.key,
            label: data.label,
            default: convertString(data.default),
            template: data.template,
            propertyType: data.propertyType,
            section: data.section,
            order: data.order,
            items: data.items,
            image: (data.image) ? data.image : {},
          });
          if (!isUpdating) {
            updatePropertyField({ propertyFields })
              .then(() => {
                updateDefaultFunc(propertyFields)
                  .then(() => {
                    addNewRuleHistory(createHistory, objectItem, parentId,
                      `Create Property(${data.propertyType})`,
                      `Create Property(${data.propertyType}) by ${objectItem.name}`,
                      'virtual');
                    confirmMessage(enqueueSnackbar, 'Property field has been added successfully.', 'success');
                  })
                  .catch(() => {
                    confirmMessage(enqueueSnackbar, 'Error in updating the Properties default value .', 'error');
                  });
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
            errMsg = `Error: Another property is using the key (${data.key}) you specified.
         Please update property key name.`;
          }
          confirmMessage(enqueueSnackbar, errMsg, 'error');
        }
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
          updateDefaultFunc(data)
            .then(() => {
              addNewRuleHistory(createHistory, objectItem, parentId,
                `Update the Property field(${newData.label} ${newData.propertyType})`,
                `Update the Property field(${newData.label} ${newData.propertyType}) by ${objectItem.name}`,
                'virtual');
              confirmMessage(enqueueSnackbar, 'Property field has been updated successfully.', 'success');
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, 'Error in updating the Properties default value .', 'error');
            });
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
          if (reg.test(item.template)) {
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
      const ruleKeyIndex = sendData.findIndex((rk) => rk._id === oldData._id);
      const validateResult = validate(newData);
      const validateFlag = validateResult.validation;
      const updateData = validateResult.updatedData;
      if (ruleKeyIndex > -1 && validateFlag) {
        sendData.splice(ruleKeyIndex, 1, {
          key: updateData.key,
          label: updateData.label,
          default: convertString(updateData.default),
          template: updateData.template,
          propertyType: updateData.propertyType,
          section: updateData.section,
          order: updateData.order,
          items: updateData.items,
          image: (updateData.image) ? updateData.image : {},
        });
        delete data.tableData;
        if (JSON.stringify(updateData) !== JSON.stringify(data)) {
          const errList = checkTemplate(sendData, updateData);
          if (!isUpdating && isExist(sendData, updateData.key) === 1 && errList === '') {
            setUpdatedProperties(sendData);
            setUpdatedNewData(updateData);
            setUpdatedOldData(oldData);
            if (checkUsageOldKey(updateData, oldData)) {
              setChangeType(true);
            } else {
              setChangeType(false);
              updateAction(changeKey(updateData, oldData, sendData), updateData);
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

  const handleDelete = (oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const ruleKeyIndex = propertyFields.findIndex((rk) => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        const deletedKey = propertyFields[ruleKeyIndex].key;
        propertyFields.splice(ruleKeyIndex, 1);
        if (!isUpdating) {
          updatePropertyField({ propertyFields })
            .then(() => {
              updateDefaultFunc(propertyFields, deletedKey)
                .then(() => {
                  addNewRuleHistory(createHistory, objectItem, parentId,
                    `Delete the property field (${oldData.label})`,
                    `Delete the property field (${oldData.label}) by ${objectItem.name}`,
                    'virtual');
                  confirmMessage(enqueueSnackbar, 'Property field has been deleted successfully.', 'success');
                })
                .catch(() => {
                  confirmMessage(enqueueSnackbar, 'Error in updating property field.', 'error');
                });
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, 'Error in deleting property field.', 'error');
            });
        }
      }
    }, 600);
  });

  return (
    <>
      <CustomMaterialTableModal
        className="mg-edit-properties-content field"
        handleDelete={handleDelete}
        title="Edit Property Fields"
        open={open}
        tableData={tableData}
        handleClose={handleClose}
        handleAdd={handleAdd}
        handleUpdate={handleUpdate}
        options={{
          pageSize: pageNum,
          pageSizeOptions: [10, 20],
          actionsColumnIndex: -1,
          showTitle: false,
          searchFieldAlignment: 'left',
        }}
        onOrderChange={onChangeOrder}
        onChangeRowsPerPage={onChangePageNum}
        msg="Are you sure you want to delete this property?"
      />
      {
        changeType
        && (
          <CustomConfirmDlg
            open={changeType}
            msg="Do you change the type of the property? This is used on the other property as Template."
            confirmLabel="Update"
            handleDelete={handleUpdateType}
            handleClose={confirmDlgClose}
          />
        )
      }
    </>
  );
}

EditPropertyFields.propTypes = {
  open: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  pageNum: PropTypes.number.isRequired,
  order: PropTypes.object.isRequired,
  objectItem: PropTypes.object.isRequired,
  propertyField: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  onChangeOrder: PropTypes.func.isRequired,
  onChangePageNum: PropTypes.func.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
  updateDefaultOnCategory: PropTypes.func.isRequired,
  updateDefaultOnAttriute: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  propertyField: store.propertyFieldsData.propertyField,
  isUpdating: store.propertyFieldsData.isUpdating,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updatePropertyField,
  updateDefaultOnCategory,
  updateDefaultOnAttriute,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditPropertyFields);
