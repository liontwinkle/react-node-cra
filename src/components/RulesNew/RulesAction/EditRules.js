import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { confirmMessage, getObjectFromArray } from 'utils';
import {
  basis,
  refer,
  match,
  scope,
  tableIcons,
} from 'utils/constants';
import { updateCategory } from 'redux/actions/categories';

import './style.scss';

function EditRules({
  open,
  rules,
  updateCategory,
  handleClose,
  isUpdating,
  category,
  valueDetails,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const tableData = {
    columns: [
      {
        title: 'Basis',
        field: 'basis',
        lookup: getObjectFromArray(basis),
      },
      {
        title: 'Refer',
        field: 'refer',
        lookup: getObjectFromArray(refer),
      },
      {
        title: 'Detail',
        field: 'detail',
        lookup: getObjectFromArray(valueDetails),
      },
      {
        title: 'Match',
        field: 'match',
        lookup: getObjectFromArray(match),
      },
      { title: 'Value', field: 'value' },
      {
        title: 'Scope',
        field: 'scope',
        lookup: getObjectFromArray(scope),
      },
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
      updateCategory(category.id, { newRules: updatedData })
        .then(() => {
          confirmMessage(enqueueSnackbar, 'Success Updating the Rules.', 'success');
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error in updating new rules.', 'error');
        });
    }
  };

  const handleAdd = newData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      rules.push({
        _id: newData._id,
        basis: newData.basis,
        refer: newData.refer,
        detail: newData.detail,
        value: newData.value,
        match: newData.match,
        scope: newData.scope,
      });

      saveRules(rules);
    },
    600);
  });

  const handleUpdate = (newData, oldData) => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const ruleKeyIndex = rules.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        rules.splice(ruleKeyIndex, 1, {
          _id: newData._id,
          basis: newData.basis,
          refer: newData.refer,
          detail: newData.detail,
          value: newData.value,
          match: newData.match,
          scope: newData.scope,
        });

        saveRules(rules);
      }
    }, 600);
  });

  const handleDelete = oldData => new Promise((resolve) => {
    setTimeout(() => {
      resolve();

      const ruleKeyIndex = rules.findIndex(rk => rk._id === oldData._id);
      if (ruleKeyIndex > -1) {
        rules.splice(ruleKeyIndex, 1);
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
  isUpdating: PropTypes.bool.isRequired,
  category: PropTypes.object.isRequired,
  valueDetails: PropTypes.array.isRequired,
};

const mapStateToProps = store => ({
  isUpdating: store.categoriesData.isUpdating,
  category: store.categoriesData.category,
  valueDetails: store.productsData.valueDetails,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditRules);
