import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DialogActions, makeStyles } from '@material-ui/core';
import { CustomSearchFilter } from '../index';
import CustomModalDialog from '../CustomModalDialog';

import './style.scss';

const useStyles = makeStyles((theme) => ({
  dialogAction: {
    margin: theme.spacing(2),
  },
  dialogContent: {
    overflow: 'auto',
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
  const [stringBasedFields, setStringBasedPropertyFields] = useState([]);
  const [recvPropertyField, setRecvPropertyField] = useState({});
  useEffect(() => {
    if (propertyField.propertyFields.length > 0
      && propertyField.propertyFields !== recvPropertyField.propertyFields) {
      setRecvPropertyField(propertyField);
      const fieldData = propertyField.propertyFields.length > 0 ? propertyField.propertyFields : [];
      const stringData = [];
      fieldData.forEach((item) => {
        if (item.propertyType === 'string' || item.propertyType === 'richtext'
         || item.propertyType === 'text' || item.propertyType === 'monaco') {
          stringData.push(item);
        }
      });
      setStringBasedPropertyFields(stringData);
    }
  }, [propertyField, recvPropertyField, setStringBasedPropertyFields]);

  const handleChangeTemplate = (type) => (value) => {
    const newTemplateData = {
      ...newTemplate,
      [type]: value,
    };
    setNewTemplate(newTemplateData);
  };

  return (
    <CustomModalDialog
      handleClose={handleClose}
      open={open}
      title={msg}
    >
      <span>
        {
          stringBasedFields.map(
            (item, index) => (
              <CustomSearchFilter
                key={`${item.key}-${index.toString()}`}
                className="mb-3"
                searchItems={stringBasedFields.filter(
                  (propertyItem) => (propertyItem.key !== item.key),
                ).map((mapItem) => (mapItem.key))}
                placeholder="Input search filter"
                label={item.label}
                value={newTemplate[item.key]}
                onChange={handleChangeTemplate(item.key)}
              />
            ),
          )
        }
      </span>
      <span>
        {stringBasedFields.length === 0
          && (<label>There is no any string based properties.</label>)}
      </span>
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
    </CustomModalDialog>
  );
}

SetTemplateDlg.propTypes = {
  open: PropTypes.bool.isRequired,
  msg: PropTypes.string.isRequired,
  template: PropTypes.object,
  confirmLabel: PropTypes.string,
  propertyField: PropTypes.object.isRequired,
  handleSetTemplate: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

SetTemplateDlg.defaultProps = {
  confirmLabel: 'Set Template',
  template: {},
};

export default SetTemplateDlg;
