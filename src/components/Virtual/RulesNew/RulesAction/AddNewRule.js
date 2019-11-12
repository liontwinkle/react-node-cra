import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
} from '@material-ui/core';

import {
  basis, refer, match, scope,
} from 'utils/constants';

import { confirmMessage, getPreFilterData, useStyles } from 'utils';
import { addNewRuleHistory } from 'utils/ruleManagement';
import { updateCategory } from 'redux/actions/categories';
import { createHistory } from 'redux/actions/history';
import AddNewRuleBody from './AddNewRuleBody';

function AddNewRule({
  open,
  isUpdating,
  handleClose,
  updateCategory,
  createHistory,
  valueDetails,
  category,
  rules,
  products,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [ruleData, setRuleData] = useState({
    basis: basis[0],
    refer: refer[0],
    match: match[0],
    scope: scope[0],
    detail: valueDetails[0],
    value: '',
  });

  const [previewValue, setPreviewValue] = useState(0);

  const getPreviewProducts = (newRules) => {
    const filterProducts = () => getPreFilterData(newRules, products);
    setPreviewValue(filterProducts().length);
  };

  const handleSelectChange = (field) => (item) => {
    const newClient = {
      ...ruleData,
      [field]: item,
    };
    const newRules = [{
      basis: ruleData.basis.key,
      refer: ruleData.refer.key,
      match: ruleData.match.key,
      scope: ruleData.scope.key,
      detail: ruleData.detail.key,
      value: ruleData.value,
    }];
    newRules[0][field] = item.key;
    getPreviewProducts(newRules);
    setRuleData(newClient);
  };

  const handleChange = (e) => {
    const newClient = {
      ...ruleData,
      value: e.target.value,
    };
    const newRules = [{
      basis: ruleData.basis.key,
      refer: ruleData.refer.key,
      match: ruleData.match.key,
      scope: ruleData.scope.key,
      detail: ruleData.detail.key,
      value: e.target.value,
    }];
    getPreviewProducts(newRules);
    setRuleData(newClient);
  };

  const disabled = !(
    ruleData.basis
    && ruleData.refer
    && ruleData.scope
    && ruleData.match
    && (ruleData.value !== '')
  );

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
      updateCategory(category.id, { rules: updatedData })
        .then(() => {
          confirmMessage(enqueueSnackbar, 'Success creating the Rule.', 'success');
          handleClose();
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error in updating new rules.', 'error');
        });
    }
  };

  const handleSubmit = () => {
    if (!isUpdating && !disabled) {
      if (!rules.find((item) => (
        item.detail.key === ruleData.detail.key
        && item.match.key === ruleData.match.key
        && item.value === ruleData.value
      ))) {
        rules.push(ruleData);
        const msgCurrent = `Create New Rule(basis: ${ruleData.basis.key},refer: ${ruleData.refer.key},
            detail: ${ruleData.detail.key},match: ${ruleData.match.key},criteria: ${ruleData.value})`;
        const msgParent = `Add New Rule in Child ${category.name} (basis: ${ruleData.basis.key},
        refer: ${ruleData.refer.key},detail: ${ruleData.detail.key},match: ${ruleData.match.key},
        criteria: ${ruleData.value})`;
        addNewRuleHistory(createHistory, category, category.parentId, msgCurrent, msgParent, 'virtual');
        saveRules(rules);
      } else {
        confirmMessage(enqueueSnackbar, 'The search key is duplicated.', 'error');
      }
    } else {
      confirmMessage(enqueueSnackbar, 'Please fill the Criteria field.', 'error');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Add Rule
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <AddNewRuleBody
          handleSelectChange={handleSelectChange}
          ruleData={ruleData}
          previewNumber={previewValue}
          handleChange={handleChange}
          valueDetails={valueDetails}
        />
      </DialogContent>

      <DialogActions className={classes.dialogAction}>
        <button
          className="mg-button secondary"
          disabled={isUpdating}
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          className="mg-button primary"
          disabled={isUpdating}
          onClick={handleSubmit}
        >
          Save
        </button>
      </DialogActions>
    </Dialog>
  );
}

AddNewRule.propTypes = {
  open: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  rules: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
  valueDetails: PropTypes.array.isRequired,
  category: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  products: store.categoriesData.preProducts,
  category: store.categoriesData.category,
  isUpdating: store.categoriesData.isUpdating,
  valueDetails: store.productsData.data.valueDetails,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateCategory,
  createHistory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddNewRule);
