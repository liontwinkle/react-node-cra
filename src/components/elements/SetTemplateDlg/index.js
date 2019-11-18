// import React, { useState, useEffect } from 'react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
} from '@material-ui/core';
import { CustomSearchFilter } from '../index';

const useStyles = makeStyles((theme) => ({
  dialogAction: {
    margin: theme.spacing(2),
  },
  dialogContent: {
    overflow: 'unset',
  },
}));

function SetTemplateDlg({
  open,
  msg,
  confirmLabel,
  handleSetTemplate,
  handleClose,
  template,
  propertyField,
}) {
  const classes = useStyles();

  const [newTemplate, setNewTemplate] = useState(template);
  // const [stringBasedFields, setStringBasedPropertyFields] = useState([]);
  // const [propertyField,
  // useEffect(()=>{
  //
  // })

  const handleChangeTemplate = (value) => {
    setNewTemplate(value);
  };
  console.log('#### DEBUG PROPERTY FIELDS: ', propertyField); // fixme
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        {msg}
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <span>
          <CustomSearchFilter
            className="mb-3"
            searchItems={propertyField.propertyFields.map((item) => (item.key))}
            placeholder="Input search filter"
            label="Template"
            value={newTemplate}
            onChange={(e) => handleChangeTemplate(e)}
          />
        </span>
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
          onClick={handleSetTemplate({ template: newTemplate })}
        >
          {confirmLabel}
        </button>
      </DialogActions>
    </Dialog>
  );
}

SetTemplateDlg.propTypes = {
  open: PropTypes.bool.isRequired,
  msg: PropTypes.string.isRequired,
  template: PropTypes.string,
  confirmLabel: PropTypes.string,
  propertyField: PropTypes.object.isRequired,
  handleSetTemplate: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

SetTemplateDlg.defaultProps = {
  confirmLabel: 'Set Template',
  template: '',
};

export default SetTemplateDlg;
