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

import { ruleKeyTypes } from 'utils/constants';
import { updateCategory } from 'redux/actions/categories';
import { CustomInput, CustomSelectWithLabel } from 'components/elements';

const useStyles = makeStyles(theme => ({
  dialogAction: {
    margin: theme.spacing(2),
  },
  dialogContent: {
    overflow: 'unset',
  },
}));

function AddPropertyFields(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const {
    open,
    isUpdating,
    category,
    handleClose,
    updateCategory,
  } = props;

  const [ruleKeyData, setRuleKeyData] = useState({
    key: '',
    label: '',
    ruleType: { key: 'string', label: 'String' },
  });
  const handleChange = field => (e) => {
    const newClient = {
      ...ruleKeyData,
      [field]: e.target.value,
    };
    setRuleKeyData(newClient);
  };
  const handleChangeType = (ruleType) => {
    const newClient = {
      ...ruleKeyData,
      ruleType,
    };
    setRuleKeyData(newClient);
  };

  const disabled = !(category && ruleKeyData.key && ruleKeyData.label && ruleKeyData.ruleType);

  const handleSubmit = () => {
    if (!isUpdating && !disabled) {
      const { ruleKeys } = category;
      ruleKeys.push({
        ...ruleKeyData,
        ruleType: ruleKeyData.ruleType.key,
      });

      updateCategory(category.id, { ruleKeys })
        .then(() => {
          enqueueSnackbar('Property fields has been added successfully.', { variant: 'success' });
          handleClose();
        })
        .catch(() => {
          enqueueSnackbar('Error in adding property fields.', { variant: 'error' });
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
        Add Rule Keys
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <CustomInput
          className="mb-3"
          label="Key"
          inline
          value={ruleKeyData.key}
          onChange={handleChange('key')}
        />
        <CustomInput
          className="mb-3"
          label="Label"
          inline
          value={ruleKeyData.label}
          onChange={handleChange('label')}
        />
        <CustomSelectWithLabel
          label="Type"
          inline
          value={ruleKeyData.ruleType}
          items={ruleKeyTypes}
          onChange={handleChangeType}
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
          disabled={isUpdating || disabled}
          onClick={handleSubmit}
        >
          Save
        </button>
      </DialogActions>
    </Dialog>
  );
}

AddPropertyFields.propTypes = {
  open: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  category: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
};

AddPropertyFields.defaultProps = {
  category: null,
};

const mapStateToProps = store => ({
  isUpdating: store.categoriesData.isUpdating,
  category: store.categoriesData.category,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateCategory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddPropertyFields);