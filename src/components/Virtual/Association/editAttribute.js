import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';

import { updateAttribute } from 'redux/actions/attribute';
import { createHistory } from 'redux/actions/history';
import { CustomInput } from 'components/elements';
import { confirmMessage } from 'utils';
import { checkNameDuplicate } from 'utils/attributeManagement';
import { addNewRuleHistory } from 'utils/ruleManagement';

const useStyles = makeStyles((theme) => ({
  dialogAction: { margin: theme.spacing(2) },
}));

function EditAttribute({
  isUpdating,
  attribute,
  attributes,
  updateAttribute,
  createHistory,
  open,
  handleClose,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [attributeName, setAttributeName] = useState(attribute.name);

  const handleChange = (e) => { setAttributeName(e.target.value); };

  const disabled = !(attributeName === attribute.name || attribute === '' || !isUpdating);
  const handleSubmit = () => {
    if (!checkNameDuplicate(attributes, attributeName, attribute.groupId) && !disabled) {
      updateAttribute(attribute._id, { name: attributeName })
        .then(() => {
          addNewRuleHistory(createHistory, attribute, attribute.groupId,
            `Name is changed as ${attributeName}`,
            `The Child ${attribute.name} Name is changed as ${attributeName}`,
            'attributes');
          confirmMessage(enqueueSnackbar, 'Attribute name has been updated successfully.', 'success');
          handleClose();
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error in adding category.', 'error');
        });
    } else {
      confirmMessage(enqueueSnackbar, 'Attribute name is duplicated.', 'info');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Edit Attribute
      </DialogTitle>

      <DialogContent>
        <CustomInput
          className="mb-3"
          label="Name"
          inline
          value={attributeName}
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions className={classes.dialogAction}>
        <button
          className="mg-button secondary"
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

EditAttribute.propTypes = {
  isUpdating: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  attribute: PropTypes.object,
  attributes: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  updateAttribute: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
};

EditAttribute.defaultProps = {
  attribute: null,
};

const mapStateToProps = (store) => ({
  isUpdating: store.attributesData.isUpdating,
  attributes: store.attributesData.attributes,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updateAttribute,
  createHistory,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditAttribute);
