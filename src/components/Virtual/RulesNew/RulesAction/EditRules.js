import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { confirmMessage, getObjectFromArray } from 'utils/index';
import { addNewRuleHistory } from 'utils/ruleManagement';
import {
  basis, refer, match, scope, tableIcons,
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
  const tableData = {
    columns: [
      { title: 'Basis', field: 'basis', lookup: getObjectFromArray(basis) },
      { title: 'Refer', field: 'refer', lookup: getObjectFromArray(refer) },
      { title: 'Detail', field: 'detail', lookup: getObjectFromArray(valueDetails) },
      { title: 'Match', field: 'match', lookup: getObjectFromArray(match) },
      { title: 'Value', field: 'value' },
      { title: 'Scope', field: 'scope', lookup: getObjectFromArray(scope) },
    ],
    data: rules,
  };

  const saveRules = (updatedState) => {
    const updatedData = [];
    updatedState.forEach((item) => {
      const value = `[${item.detail}${item.match}]${item.value}`;
      updatedData.push({
        _id: item._id,
        basis: item.basis,
        refer: item.refer,
        value,
        scope: 0,
      });
    });

    if (!isUpdating) {
      updateCategory(category.id, { rules: updatedData })
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
        && item.match === newData.match
        && item.value === newData.value
      ))) {
        rules.push({
          _id: newData._id,
          basis: newData.basis,
          refer: newData.refer,
          detail: newData.detail,
          value: newData.value,
          match: newData.match,
          scope: newData.scope,
        });
        const msgCurrent = `Create New Rule(basis: ${newData.basis.key},refer: ${newData.refer.key},
            detail: ${newData.detail.key},match: ${newData.match.key},criteria: ${newData.value})`;
        const msgParent = `Add New Rule in Child ${category.name} (basis: ${newData.basis.key},
        refer: ${newData.refer.key},detail: ${newData.detail.key},match: ${newData.match.key},
        criteria: ${newData.value})`;
        addNewRuleHistory(createHistory, category, category.parentId, msgCurrent, msgParent, 'virtual');
        saveRules(rules);
      }
    },
    600);
  });

  const handleUpdate = (newData, oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const data = JSON.parse(JSON.stringify(oldData));
      const ruleKeyIndex = rules.findIndex((rk) => rk._id === oldData._id);
      if (!isCreating && ruleKeyIndex > -1) {
        rules.splice(ruleKeyIndex, 1, {
          _id: newData._id,
          basis: newData.basis,
          refer: newData.refer,
          detail: newData.detail,
          value: newData.value,
          match: newData.match,
          scope: newData.scope,
        });
        delete data.tableData;
        if (JSON.stringify(newData) !== JSON.stringify(data)) {
          const msgCurrent = `Update Rule as (basis: ${newData.basis},refer: ${newData.refer},
            detail: ${newData.detail},match: ${newData.match},criteria: ${newData.value})`;
          const msgParent = `Update Rule in Child ${category.name} (basis: ${newData.basis}, 
                  refer: ${newData.refer},detail: ${newData.detail},match: ${newData.match},
                  criteria: ${newData.value})`;
          addNewRuleHistory(createHistory, category, category.parentId, msgCurrent, msgParent, 'virtual');
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

      const ruleKeyIndex = rules.findIndex((rk) => rk._id === oldData._id);
      if (!isCreating && ruleKeyIndex > -1) {
        rules.splice(ruleKeyIndex, 1);
        const msgCurrent = `Delete Rule (basis: ${oldData.basis},refer: ${oldData.refer},
            detail: ${oldData.detail},match: ${oldData.match},criteria: ${oldData.value})`;
        const msgParent = `Rule is deleted in Child ${category.name} (basis: ${oldData.basis}, 
                  refer: ${oldData.refer},detail: ${oldData.detail},match: ${oldData.match},
                  criteria: ${oldData.value})`;
        addNewRuleHistory(createHistory, category, category.parentId, msgCurrent, msgParent, 'virtual');
        saveRules(rules);
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
        Edit Rules
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
          localization={{
            body: {
              editRow: {
                deleteText: 'Are you sure you want to delete this rule?',
              },
            },
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

EditRules.propTypes = {
  open: PropTypes.bool.isRequired,
  rules: PropTypes.array.isRequired,
  updateCategory: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  isCreating: PropTypes.bool.isRequired,
  category: PropTypes.object.isRequired,
  valueDetails: PropTypes.array.isRequired,
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
