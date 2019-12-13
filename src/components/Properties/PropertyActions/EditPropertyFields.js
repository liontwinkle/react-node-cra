import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { CustomConfirmDlg } from 'components/elements';
import CustomMaterialTableModal from 'components/elements/CustomMaterialTableModal';
import { isExist, confirmMessage, convertString } from 'utils';
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

  const handleAdd = (newData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      const errList = checkTemplate(propertyFields, newData);
      const validatePath = checkPathValidate(propertyFields, newData);
      if (isExist(propertyFields, newData.key) === 0 && errList === '' && validatePath) {
        propertyFields.push({
          key: newData.key,
          label: newData.label,
          default: convertString(newData.default),
          template: newData.template,
          propertyType: newData.propertyType,
          section: newData.section,
          order: newData.order,
          items: newData.items,
          image: (newData.image) ? newData.image : {},
        });
        if (!isUpdating) {
          updatePropertyField({ propertyFields })
            .then(() => {
              updateDefaultFunc(propertyFields)
                .then(() => {
                  addNewRuleHistory(createHistory, objectItem, parentId,
                    `Create Property(${newData.propertyType})`,
                    `Create Property(${newData.propertyType}) by ${objectItem.name}`,
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
      if (ruleKeyIndex > -1) {
        sendData.splice(ruleKeyIndex, 1, {
          key: newData.key,
          label: newData.label,
          default: convertString(newData.default),
          template: newData.template,
          propertyType: newData.propertyType,
          section: newData.section,
          order: newData.order,
          items: newData.items,
          image: (newData.image) ? newData.image : {},
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
