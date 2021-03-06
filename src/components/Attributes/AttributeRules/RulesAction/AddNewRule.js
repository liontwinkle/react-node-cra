import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useSnackbar } from 'notistack';
import { DialogActions } from '@material-ui/core';

import AddNewRuleBody from 'components/shared/Rules/RulesAction/AddNewRuleBody';
import { updateAttribute } from 'redux/actions/attribute';
import { createHistory } from 'redux/actions/history';

import { confirmMessage, useStyles } from 'utils';
import { addNewRuleHistory, filterProducts, getUniqueValues } from 'utils/ruleManagement';
import {
  basis, refer, match, scope, ruleType,
} from 'utils/constants';

import CustomModalDialog from 'components/elements/CustomModalDialog';
import RulesAvailableValues from 'components/shared/Rules/RulesAvailableValues';

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
      updateAttribute(attribute._id, { rules: updatedData })
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
        && item.type.key === ruleData.type.key
        && item.criteria === ruleData.criteria
      ))) {
        rules.push(ruleData);
        const msgCurrent = `Create New Rule(basis: ${ruleData.basis.key},refer: ${ruleData.refer.key},
            detail: ${ruleData.key.key},type: ${ruleData.type.key},criteria: ${ruleData.criteria})`;
        const msgParent = `Add New Rule in Child ${attribute.name} (basis: ${ruleData.basis.key}, 
                  refer: ${ruleData.refer.key},detail: ${ruleData.key.key},type: ${ruleData.type.key},
                  criteria: ${ruleData.criteria})`;
        addNewRuleHistory(createHistory, attribute, attribute.group_id, msgCurrent, msgParent, 'attributes');
        saveRules(rules);
      } else {
        confirmMessage(enqueueSnackbar, 'The search key is duplicated.', 'error');
      }
    } else {
      confirmMessage(enqueueSnackbar, 'Please fill the Criteria field.', 'error');
    }
  };

  const [showAvailableValues, setShowAvailableValues] = useState(false);
  const [availableValues, setAvailableValues] = useState([]);

  const getAvailableData = () => {
    const validData = getUniqueValues(products, ruleData.key.key);
    setAvailableValues(validData);
    setShowAvailableValues(true);
  };

  const handleAvailableClose = () => {
    setShowAvailableValues(!showAvailableValues);
  };

  return (
    <>
      <CustomModalDialog
        handleClose={handleClose}
        open={open}
        title="Add Rule"
      >
        <AddNewRuleBody
          handleSelectChange={handleSelectChange}
          ruleData={ruleData}
          previewNumber={previewValue}
          handleChange={handleChange}
          valueDetails={valueDetails}
          category={attribute}
          getAvailableData={getAvailableData}
        />

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
      </CustomModalDialog>
      {
        showAvailableValues
        && (
          <RulesAvailableValues
            handleClose={handleAvailableClose}
            open={showAvailableValues}
            tableData={availableValues}
            showKey={ruleData.key.label}
          />
        )
      }
    </>
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
