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

import { updatePorpertyField } from 'redux/actions/propertyFields';
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

function AddSections(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const {
    open,
    isUpdating,
    propertyField,
    handleClose,
    updatePorpertyField,
  } = props;

  const [sectionsData, setSectionsData] = useState({
    key: '',
    label: '',
    order: 0,
  });
  const handleChange = field => (e) => {
    const newClient = {
      ...sectionsData,
      [field]: e.target.value,
    };
    setSectionsData(newClient);
  };

  const disabled = !(sectionsData.key && sectionsData.label && (sectionsData.order !== ''));

  const handleSubmit = () => {
    if (!isUpdating && !disabled) {
      const { sections } = propertyField;
      if (isExist(sections, sectionsData.key) === 0) {
        sections.push(sectionsData);

        updatePorpertyField(propertyField.id, { sections })
          .then(() => {
            enqueueSnackbar('Section has been added successfully.',
              {
                variant: 'success',
                autoHideDuration: 1000,
              });
            handleClose();
          })
          .catch(() => {
            enqueueSnackbar('Error in adding section.', {
              variant: 'error',
              autoHideDuration: 4000,
            });
          });
      } else {
        const errMsg = `Error: Another section is using the key (${sectionsData.key}) you specified.
         Please update section key name.`;
        enqueueSnackbar(errMsg,
          {
            variant: 'error',
            autoHideDuration: 4000,
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
        Add Sections
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
        <CustomInput
          className="mb-3"
          label="Order"
          type="number"
          min={1}
          inline
          value={sectionsData.order}
          onChange={handleChange('order')}
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

AddSections.propTypes = {
  open: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  propertyField: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  updatePorpertyField: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  isUpdating: store.propertyFieldsData.isUpdating,
  propertyField: store.propertyFieldsData.propertyField,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updatePorpertyField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddSections);
