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

import AddNewRuleBody from 'components/Virtual/RulesNew/RulesAction/AddNewRuleBody';
import { updateAttribute } from 'redux/actions/attribute';
import { createHistory } from 'redux/actions/history';
import {
  basis, refer, match, scope, ruleType,
} from 'utils/constants';
import { confirmMessage, getPreFilterData, useStyles } from 'utils';
import { addNewRuleHistory } from 'utils/ruleManagement';

function AddNewRule({
  open,
  isUpdating,
  isCreating,
  handleClose,
  updateAttribute,
  createHistory,
  valueDetails,
  attribute,
  rules,
  displayRules,
  products,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [ruleData, setRuleData] = useState({
    basis: basis[0],
    refer: refer[0],
    match: match[0],
    scope: scope[0],
    key: valueDetails[0],
    criteria: '',
    ruleType: ruleType[0],
  });

  const [previewValue, setPreviewValue] = useState(0);

  const getPreviewProducts = (newRules) => {
    setPreviewValue(getPreFilterData(newRules, products).length);
  };

  const searchFunction = (newClient) => {
    const newRules = [{
      basis: newClient.basis.key,
      refer: newClient.refer.key,
      match: newClient.match.key,
      scope: newClient.scope.key,
      key: newClient.key.key,
      criteria: newClient.criteria,
      ruleType: newClient.ruleType,
    }];
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
    if (field === 'key' && newClient.criteria && newClient.criteria !== '') {
      searchFunction(newClient);
    }
  };

  const handleChange = (e) => {
    const newClient = {
      ...ruleData,
      criteria: e.target.value,
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
    && ruleData.match
    && (ruleData.criteria !== '')
  );

  const saveRules = (updatedState) => {
    const updatedData = [];
    updatedState.forEach((item) => {
      updatedData.push({
        basis: item.basis.key,
        refer: item.refer.key,
        match: item.match.key,
        scope: 0,
        key: item.key.key,
        criteria: item.criteria,
        ruleType: item.ruleType.key,
      });
    });

    if (!isUpdating) {
      updateAttribute(attribute.id, { rules: updatedData })
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
    if (!isUpdating && !isCreating && !disabled) {
      if (!displayRules.find((item) => (
        item.key.key === ruleData.key.key
        && item.match.key === ruleData.match.key
        && item.criteria === ruleData.criteria
      ))) {
        rules.push(ruleData);
        const msgCurrent = `Create New Rule(basis: ${ruleData.basis.key},refer: ${ruleData.refer.key},
            detail: ${ruleData.key.key},match: ${ruleData.match.key},criteria: ${ruleData.criteria})`;
        const msgParent = `Add New Rule in Child ${attribute.name} (basis: ${ruleData.basis.key}, 
                  refer: ${ruleData.refer.key},detail: ${ruleData.key.key},match: ${ruleData.match.key},
                  criteria: ${ruleData.criteria})`;
        addNewRuleHistory(createHistory, attribute, attribute.groupId, msgCurrent, msgParent, 'attributes');
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
  isCreating: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  updateAttribute: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  attribute: PropTypes.object.isRequired,
  valueDetails: PropTypes.array.isRequired,
  rules: PropTypes.array.isRequired,
  displayRules: PropTypes.array.isRequired,
  products: PropTypes.array.isRequired,
};

const mapStateToProps = (store) => ({
  isUpdating: store.attributesData.isUpdating,
  attribute: store.attributesData.attribute,
  valueDetails: store.productsData.data.valueDetails,
  products: store.productsData.data.products,
  isCreating: store.historyData.isCreating,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateAttribute,
  createHistory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddNewRule);
