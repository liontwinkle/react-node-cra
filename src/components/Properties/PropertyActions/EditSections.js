import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import CustomMaterialTableModal from 'components/elements/CustomMaterialTableModal';

import { confirmMessage, isExist } from 'utils';
import { validateSection } from 'utils/propertyManagement';
import { updatePropertyField } from 'redux/actions/propertyFields';

function EditSections({
  open,
  order,
  pageNum,
  propertyField,
  isUpdating,
  updatePropertyField,
  handleClose,
  onChangeOrder,
  onChangePageNum,
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

  if (order.index >= 0) {
    tableData.columns[order.index].defaultSort = order.direction;
  }

  const handleAdd = (newData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const validateResult = validateSection(newData, sections, enqueueSnackbar);
      const data = validateResult.updateData;
      if (validateResult.validation) {
        if (isExist(sections, newData.key) === 0) {
          sections.push({
            key: data.key,
            label: data.label,
            order: data.order,
          });
          if (!isUpdating) {
            updatePropertyField({ sections })
              .then(() => {
                confirmMessage(enqueueSnackbar, 'Property field has been added successfully.', 'success');
              })
              .catch(() => {
                confirmMessage(enqueueSnackbar, 'Error in adding property field.', 'error');
              });
          }
        } else {
          const errMsg = `Error: Another section is using the key (${data.key}) you specified.
         Please update section key name.`;
          confirmMessage(enqueueSnackbar, errMsg, 'error');
        }
      }
    }, 600);
  });

  const handleUpdate = (newData, oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const ruleKeyIndex = sections.findIndex((rk) => rk._id === oldData._id);
      const validateResult = validateSection(newData, sections, enqueueSnackbar);
      const data = validateResult.updateData;

      if (ruleKeyIndex > -1 && validateResult.validation) {
        sections.splice(ruleKeyIndex, 1, {
          key: data.key,
          label: data.label,
          order: data.order,
          _id: data._id,
        });
        if (!isUpdating) {
          updatePropertyField({ sections })
            .then(() => {
              confirmMessage(enqueueSnackbar, 'Property field has been updated successfully.', 'success');
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, 'Error in updating property field.', 'error');
            });
        }
      }
    }, 600);
  });

  const handleDelete = (oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const ruleKeyIndex = sections.findIndex((rk) => rk._id === oldData._id);
      const deletedSection = sections[ruleKeyIndex];
      const { propertyFields } = propertyField;
      const updatedProperties = JSON.parse(JSON.stringify(propertyFields));
      propertyFields.forEach((item, index) => {
        if (item.section === deletedSection.key) {
          updatedProperties[index].section = null;
        }
      });
      if (ruleKeyIndex > -1) {
        sections.splice(ruleKeyIndex, 1);
        if (!isUpdating) {
          updatePropertyField({ sections, propertyFields: updatedProperties })
            .then(() => {
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
    <CustomMaterialTableModal
      open={open}
      title="Edit Sections"
      tableData={tableData}
      className="mg-edit-properties-content"
      handleClose={handleClose}
      handleAdd={handleAdd}
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
      options={{
        pageSize: pageNum,
        pageSizeOptions: [10, 20],
        actionsColumnIndex: -1,
        showTitle: false,
        searchFieldAlignment: 'left',
      }}
      onOrderChange={onChangeOrder}
      onChangeRowsPerPage={onChangePageNum}
      msg="Are you sure you want to delete this section?"
    />
  );
}

EditSections.propTypes = {
  open: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  pageNum: PropTypes.number.isRequired,
  order: PropTypes.object.isRequired,
  propertyField: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  onChangeOrder: PropTypes.func.isRequired,
  onChangePageNum: PropTypes.func.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  propertyField: store.propertyFieldsData.propertyField,
  isUpdating: store.propertyFieldsData.isUpdating,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updatePropertyField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditSections);
