import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core';

import { updateCategory } from 'redux/actions/categories';
import { CustomInput, CustomSelect } from 'components/elements';
import {
  basis, refer, match, scope,
} from 'utils/constants';

const useStyles = makeStyles(theme => ({
  dialogAction: {
    margin: theme.spacing(2),
  },
  dialogContent: {
    overflow: 'unset',
  },
}));

function AddNewRule(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const {
    open,
    isUpdating,
    handleClose,
    updateCategory,
    valueDetails,
    category,
    rules,
  } = props;

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

  const disabled = !(ruleData.basis
    && ruleData.refer
    && ruleData.scope
    && ruleData.match
    && (ruleData.value !== ''));

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
        .then(() => {
          enqueueSnackbar('Success creating the Rule.',
            {
              variant: 'success',
              autoHideDuration: 1500,
            });
          handleClose();
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

  const handleSubmit = () => {
    if (!isUpdating && !disabled) {
      rules.push(ruleData);
      saveRules(rules);
    } else {
      enqueueSnackbar('Please fill the Criteria field.',
        {
          variant: 'error',
          autoHideDuration: 4000,
        });
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
  valueDetails: PropTypes.array.isRequired,
  rules: PropTypes.array.isRequired,
};

const mapStateToProps = store => ({
  isUpdating: store.categoriesData.isUpdating,
  valueDetails: store.productsData.valueDetails,
  category: store.categoriesData.category,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddNewRule);
