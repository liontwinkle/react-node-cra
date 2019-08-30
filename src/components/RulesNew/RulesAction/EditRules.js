import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import MaterialTable from 'material-table';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';

import {
  basis, refer, match, scope, tableIcons,
} from 'utils/constants';
import { updateCategory } from 'redux/actions/categories';
import { getObjectFromArray } from '../../../utils';
import './style.scss';

function EditRules(props) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    open,
    rules,
    updateCategory,
    handleClose,
    isUpdating,
    category,
    valueDetails,
  } = props;

  const tableData = {
    columns: [
      {
        title: 'Basis',
        field: 'basis',
        lookup: getObjectFromArray(basis),
      },
      {
        title: 'Detail',
        field: 'detail',
        lookup: getObjectFromArray(valueDetails),
      },
      {
        title: 'Refer',
        field: 'refer',
        lookup: getObjectFromArray(refer),
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
          enqueueSnackbar('Success Updating the Rules.',
            {
              variant: 'success',
              autoHideDuration: 1500,
            });
        })
        .catch(() => {
          enqueueSnackbar('Error in updating new rules.',
            {
              variant: 'error',
              autoHideDuration: 4000,
            });
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
