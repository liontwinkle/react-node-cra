import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import CustomMaterialTableModal from 'components/elements/CustomMaterialTableModal';

import { confirmMessage, getObjectFromArray } from 'utils/index';
import { addNewRuleHistory } from 'utils/ruleManagement';
import {
  basis, refer, match, scope, ruleType,
} from 'utils/constants';
import { updateCategory } from 'redux/actions/categories';
import { createHistory } from 'redux/actions/history';

import './style.scss';

function EditRules({
  open,
  rules,
  updateCategory,
  createHistory,
  handleClose,
  isUpdating,
  isCreating,
  category,
  valueDetails,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const rule = (category.parent_id === null) ? ruleType : new Array(ruleType[0]);
  const tableData = {
    columns: [
      { title: 'Basis', field: 'basis', lookup: getObjectFromArray(basis) },
      { title: 'Refer', field: 'refer', lookup: getObjectFromArray(refer) },
      { title: 'Key', field: 'key', lookup: getObjectFromArray(valueDetails) },
      { title: 'Type', field: 'type', lookup: getObjectFromArray(match) },
      { title: 'Criteria', field: 'criteria' },
      { title: 'Scope', field: 'scope', lookup: getObjectFromArray(scope) },
      { title: 'Rule Type', field: 'ruleType', lookup: getObjectFromArray(rule) },
    ],
    data: rules,
  };

  const saveRules = (updatedState) => {
    const updatedData = [];
    updatedState.forEach((item) => {
      updatedData.push({
        basis: item.basis,
        refer: item.refer,
        type: item.type,
        criteria: item.criteria || '',
        key: item.key,
        scope: 0,
        ruleType: item.ruleType,
      });
    });

    if (!isUpdating) {
      updateCategory(category._id, { rules: updatedData })
        .then(() => {
          confirmMessage(enqueueSnackbar, 'Success Updating the Rules.', 'success');
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error in updating new rules.', 'error');
        });
    }
  };

  const handleAdd = (newData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();
      if (!isCreating && !rules.find((item) => (
        item.detail === newData.detail
        && item.basis === newData.basis
        && item.type === newData.type
        && item.key === newData.key
        && item.ruleType === newData.ruleType
        && item.criteria === newData.criteria
      ))) {
        rules.push({
          basis: newData.basis,
          refer: newData.refer,
          key: newData.key,
          criteria: newData.criteria,
          type: newData.type,
          scope: newData.scope,
          ruleType: newData.ruleType,
        });
        const msgCurrent = `Create New Rule(basis: ${newData.basis.key},refer: ${newData.refer.key},
            detail: ${newData.key.key},type: ${newData.type.key},criteria: ${newData.criteria})`;
        const msgParent = `Add New Rule in Child ${category.name} (basis: ${newData.basis.key},
        refer: ${newData.refer.key},detail: ${newData.key.key},type: ${newData.type.key},
        criteria: ${newData.criteria})`;
        addNewRuleHistory(createHistory, category, category.parent_id, msgCurrent, msgParent, 'virtual');
        saveRules(rules);
      }
    },
    600);
  });

  const handleUpdate = (newData, oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const data = JSON.parse(JSON.stringify(oldData));
      const ruleKeyIndex = rules.findIndex((rk) => (
        rk.basis === oldData.basis
        && rk.refer === oldData.refer
        && rk.key === oldData.key
        && rk.criteria === oldData.criteria
        && rk.type === oldData.type
        && rk.scope === oldData.scope
        && rk.ruleType === oldData.ruleType
      ));
      if (!isCreating && ruleKeyIndex > -1) {
        rules.splice(ruleKeyIndex, 1, {
          basis: newData.basis,
          refer: newData.refer,
          key: newData.key,
          criteria: newData.criteria,
          type: newData.type,
          scope: newData.scope,
          ruleType: newData.ruleType,
        });
        delete data.tableData;
        if (JSON.stringify(newData) !== JSON.stringify(data)) {
          const msgCurrent = `Update Rule as (basis: ${newData.basis},refer: ${newData.refer},
            detail: ${newData.key},type: ${newData.type},criteria: ${newData.criteria})`;
          const msgParent = `Update Rule in Child ${category.name} (basis: ${newData.basis},
                  refer: ${newData.refer},detail: ${newData.key},type: ${newData.type},
                  criteria: ${newData.criteria})`;
          addNewRuleHistory(createHistory, category, category.parent_id, msgCurrent, msgParent, 'virtual');
          saveRules(rules);
        } else {
          confirmMessage(enqueueSnackbar, 'There is no any update.', 'info');
        }
      }
    }, 600);
  });

  const handleDelete = (oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const ruleKeyIndex = rules.findIndex((rk) => (
        rk.basis === oldData.basis
        && rk.refer === oldData.refer
        && rk.key === oldData.key
        && rk.criteria === oldData.criteria
        && rk.type === oldData.type
        && rk.scope === oldData.scope
        && rk.ruleType === oldData.ruleType
      ));
      if (!isCreating && ruleKeyIndex > -1) {
        rules.splice(ruleKeyIndex, 1);
        const msgCurrent = `Delete Rule (basis: ${oldData.basis},refer: ${oldData.refer},
            detail: ${oldData.key},type: ${oldData.type},criteria: ${oldData.criteria})`;
        const msgParent = `Rule is deleted in Child ${category.name} (basis: ${oldData.basis}, 
                  refer: ${oldData.refer},detail: ${oldData.key},type: ${oldData.type},
                  criteria: ${oldData.criteria})`;
        addNewRuleHistory(createHistory, category, category.parent_id, msgCurrent, msgParent, 'virtual');
        saveRules(rules);
      }
    }, 600);
  });

  return (
    <CustomMaterialTableModal
      open={open}
      tilte="Edit Rules"
      handleClose={handleClose}
      handleAdd={handleAdd}
      tableData={tableData}
      handleUpdate={handleUpdate}
      handleDelete={handleDelete}
      className="mg-edit-rule-content"
      options={{
        actionsColumnIndex: -1,
        showTitle: false,
        searchFieldAlignment: 'left',
      }}
      msg="Are you sure you want to delete this rule?"
    />
  );
}

EditRules.propTypes = {
  open: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool.isRequired,
  category: PropTypes.object.isRequired,
  rules: PropTypes.array.isRequired,
  valueDetails: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  isUpdating: store.categoriesData.isUpdating,
  category: store.categoriesData.category,
  valueDetails: store.productsData.data.valueDetails,
  isCreating: store.historyData.isCreating,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateCategory,
  createHistory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditRules);
