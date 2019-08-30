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

  console.log('rules>>>>', rules);// fixme
  const tableData = {
    columns: [
      {
        title: 'Basis',
        field: 'basis',
        lookup: basis,
      },
      {
        title: 'Detail',
        field: 'detail',
        lookup: valueDetails,
      },
      {
        title: 'Refer',
        field: 'refer',
        lookup: refer,
      },
      {
        title: 'Match',
        field: 'match',
        lookup: match,
      },
      { title: 'Value', field: 'value' },
      {
        title: 'Scope',
        field: 'scope',
        lookup: scope,
      },
    ],
    data: rules,
  };

  const saveRules = (updatedState) => {
    const updatedData = [];
    updatedState.forEach((item) => {
      const value = `[${item.detail.key}${item.match.key}]${item.value}`;
      updatedData.push({
        basis: item.basis.key,
        refer: item.refer.key,
        value,
        scope: 0,
      });
    });
    if (!isUpdating) {
      updateCategory(category.id, { newRules: updatedData })
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
    console.log('newData>>>', newData);// fixme
    setTimeout(() => {
      resolve();
      rules.push({
        key: newData.key,
        label: newData.label,
        order: newData.order,
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
          key: newData.key,
          label: newData.label,
          order: newData.order,
          _id: newData._id,
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
