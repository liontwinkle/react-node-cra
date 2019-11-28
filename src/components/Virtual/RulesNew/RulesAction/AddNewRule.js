import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
} from '@material-ui/core';

import {
  basis, refer, match, scope, ruleType,
} from 'utils/constants';

import { confirmMessage, useStyles } from 'utils';
import { addNewRuleHistory, filterProducts } from 'utils/ruleManagement';
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
    type: match[0],
    scope: scope[0],
    key: valueDetails[0],
    criteria: '',
    ruleType: ruleType[0],
  });

  const [previewValue, setPreviewValue] = useState(0);

  const getPreviewProducts = (newRules) => {
    setPreviewValue(filterProducts(products, newRules, 0).length);
  };

  const searchFunction = (newClient) => {
    const newRules = [newClient];
    setTimeout(() => {
      getPreviewProducts(newRules);
    }, 0);
  };

  const handleSelectChange = (field) => (item) => {
    const newClient = {
      ...ruleData,
      [field]: item,
    };
    setRuleData(newClient);
    if (newClient.criteria && newClient.criteria !== '') {
      searchFunction(newClient);
    }
  };

  const handleChange = (e) => {
    const criteriaValue = e.target.value;
    const newClient = {
      ...ruleData,
      criteria: criteriaValue,
    };
    setRuleData(newClient);
    if (newClient.criteria && newClient.criteria !== '') {
      searchFunction(newClient);
    }
  };

  const disabled = !(
    ruleData.basis
    && ruleData.refer
    && ruleData.scope
    && ruleData.type
    && (ruleData.criteria !== '')
  );

  const saveRules = (updatedState) => {
    const updatedData = [];
    updatedState.forEach((item) => {
      updatedData.push({
        basis: item.basis.key,
        refer: item.refer.key,
        type: item.type.key,
        scope: 0,
        key: item.key.key,
        criteria: item.criteria,
        ruleType: item.ruleType.key,
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
        item.key.key === ruleData.key.key
        && item.type.key === ruleData.type.key
        && item.criteria === ruleData.criteria
      ))) {
        rules.push(ruleData);
        const msgCurrent = `Create New Rule(basis: ${ruleData.basis.key},refer: ${ruleData.refer.key},
            detail: ${ruleData.key.key},type: ${ruleData.type.key},criteria: ${ruleData.criteria})`;
        const msgParent = `Add New Rule in Child ${category.name} (basis: ${ruleData.basis.key},
        refer: ${ruleData.refer.key},detail: ${ruleData.key.key},type: ${ruleData.type.key},
        criteria: ${ruleData.criteria})`;
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
          category={category}
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
  products: store.productsData.data.products,
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
