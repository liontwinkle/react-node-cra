import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import {
  basis,
  refer,
  match,
  scope,
} from 'utils/constants';
import { confirmMessage, useStyles } from 'utils';
import { addNewRuleHistory } from 'utils/ruleManagement';
import { updateCategory } from 'redux/actions/categories';
import { createHistory } from 'redux/actions/history';
import { CustomInput, CustomSelect } from 'components/elements/index';

function AddNewRule({
  open,
  isUpdating,
  handleClose,
  updateCategory,
  createHistory,
  valueDetails,
  category,
  rules,
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

  const handleSelectChange = field => (item) => {
    const newClient = {
      ...ruleData,
      [field]: item,
    };
    setRuleData(newClient);
  };

  const handleChange = (e) => {
    const newClient = {
      ...ruleData,
      value: e.target.value,
    };
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
      updateCategory(category._id, { rules: updatedData })
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
      if (!rules.find(item => (
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
        <CustomSelect
          className="mb-3"
          label="Basis"
          placeholder="Select Basis of Rule"
          value={ruleData.basis}
          items={basis}
          onChange={handleSelectChange('basis')}
        />
        <CustomSelect
          className="mb-3"
          label="Refer"
          placeholder="Select Refer of Rule"
          value={ruleData.refer}
          items={refer}
          onChange={handleSelectChange('refer')}
        />
        <CustomSelect
          className="mb-3"
          label="Detail"
          placeholder="Select Detail of Rule"
          value={ruleData.detail}
          items={valueDetails}
          onChange={handleSelectChange('detail')}
        />
        <CustomSelect
          className="mb-3"
          label="Match"
          placeholder="Select matches of Rule"
          value={ruleData.match}
          items={match}
          onChange={handleSelectChange('match')}
        />
        <CustomInput
          className="mb-3"
          label="Criteria"
          inline
          value={ruleData.value}
          onChange={handleChange}
        />
        <CustomSelect
          className="mb-3"
          label="Scope"
          placeholder="Select Scope of Rule"
          value={ruleData.scope}
          items={scope}
          onChange={handleSelectChange('scope')}
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
  handleClose: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired,
  updateCategory: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  valueDetails: PropTypes.array.isRequired,
  rules: PropTypes.array.isRequired,
};

const mapStateToProps = store => ({
  isUpdating: store.categoriesData.isUpdating,
  valueDetails: store.productsData.data.valueDetails,
  category: store.categoriesData.category,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCategory,
  createHistory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddNewRule);
