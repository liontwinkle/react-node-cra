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
import { CustomInput } from 'components/elements';
import { isExist } from '../../../utils';

const useStyles = makeStyles(theme => ({
  dialogAction: {
    margin: theme.spacing(2),
  },
  dialogContent: {
    overflow: 'unset',
  },
}));

function AddSelectItems(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const {
    open,
    isUpdating,
    category,
    handleClose,
    selectKey,
    updateCategory,
  } = props;

  const [sectionsData, setSectionsData] = useState({
    key: '',
    label: '',
  });
  const handleChange = field => (e) => {
    const newClient = {
      ...sectionsData,
      [field]: e.target.value,
    };
    setSectionsData(newClient);
  };

  const disabled = !(sectionsData.key && sectionsData.label);


  const handleSubmit = () => {
    if (!isUpdating && !disabled) {
      const { propertyFields } = category;
      const selectItems = propertyFields.filter(item => (item.key === selectKey))[0];
      let updateFlag = true;
      if (selectItems.items) {
        if (isExist(selectItems.items, sectionsData.key) === 0) {
          selectItems.items.push(sectionsData);
        } else {
          updateFlag = false;
          enqueueSnackbar('Item is already exist.', { variant: 'error' });
        }
      } else {
        selectItems.items = sectionsData;
      }

      if (updateFlag) {
        updateCategory(category.id, { propertyFields })
          .then(() => {
            enqueueSnackbar('Item has been added successfully.', { variant: 'success' });
            handleClose();
          })
          .catch(() => {
            enqueueSnackbar('Error in adding Item.', { variant: 'error' });
          });
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Add Select Items
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <CustomInput
          className="mb-3"
          label="Key"
          inline
          value={sectionsData.key}
          onChange={handleChange('key')}
        />
        <CustomInput
          className="mb-3"
          label="Label"
          inline
          value={sectionsData.label}
          onChange={handleChange('label')}
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

AddSelectItems.propTypes = {
  open: PropTypes.bool.isRequired,
  selectKey: PropTypes.string.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  category: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  updateCategory: PropTypes.func.isRequired,
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
)(AddSelectItems);
