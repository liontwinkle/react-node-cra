import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { useSnackbar } from 'notistack';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
} from '@material-ui/core';

import { confirmMessage, useStyles } from 'utils';
import { CustomImageUpload } from 'components/elements';
import isEqual from 'lodash/isEqual';
import { bindActionCreators } from 'redux';
import { makeUpdatedData, setDefault } from 'utils/propertyManagement';
import { addNewRuleHistory } from 'utils/ruleManagement';
import { createHistory } from 'redux/actions/history';

function EditImageSection({
  open,
  isObjectUpdating,
  isHistoryCreating,
  updateObject,
  createHistory,
  imageKey,
  objectItem,
  handleClose,
  fields,
  sections,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [image, setImage] = useState({
    name: '',
    path: '',
    type: '',
    imageData: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');

  const handleChangeFileName = (e) => {
    e.persist();
    setImageName(e.target.value);
  };

  const handleChangeImage = (data) => {
    if (data.length > 0) {
      const { file, fileType } = data[0];
      setImageFile(data);
      if (fileType && fileType.indexOf('image/') === 0) {
        if (file) {
          const reader = new FileReader();
          reader.addEventListener(
            'load',
            () => {
              setImage({
                ...image,
                path: file.name,
                type: fileType,
                imageData: reader.result,
              });
            },
            false,
          );
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const disabled = !(imageName !== '' && imageFile);

  const handleSubmit = () => {
    const imageUpdateData = JSON.parse(JSON.stringify(image));
    imageUpdateData.name = imageName;
    const savedProperties = JSON.parse(JSON.stringify(objectItem.properties));
    savedProperties[imageKey] = imageUpdateData;
    if (!isObjectUpdating && !disabled) {
      const saveData = setDefault(savedProperties, fields);
      if (saveData.errMsg === '') {
        if (!isObjectUpdating && !isHistoryCreating) {
          if (!isEqual(objectItem.properties, saveData.tempProperties)) {
            const updatedData = makeUpdatedData(saveData.tempProperties, fields, sections);
            const parentId = (objectItem.group_id) ? objectItem.group_id : objectItem.parent_id;
            updateObject(objectItem._id, { properties: updatedData })
              .then(() => {
                addNewRuleHistory(createHistory, objectItem, parentId,
                  'Update Properties',
                  `The properties of the Child ${objectItem.name} is updated.`,
                  'virtual');
                confirmMessage(enqueueSnackbar, 'Properties has been updated successfully.', 'success');
              })
              .catch(() => {
                confirmMessage(enqueueSnackbar, 'Error in updating properties.', 'error');
              });
          }
        }
      } else {
        confirmMessage(enqueueSnackbar, saveData.errMsg, 'error');
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
       Edit Image File
      </DialogTitle>

      <DialogContent className={classes.dialogContent}>
        <CustomImageUpload
          className="mb-3"
          label="Image Upload"
          value={imageFile}
          name={imageName}
          onFileNameChange={handleChangeFileName}
          onChange={handleChangeImage}
        />
      </DialogContent>

      <DialogActions className={classes.dialogAction}>
        <button
          className="mg-button secondary"
          disabled={isObjectUpdating}
          onClick={handleClose}
        >
          Cancel
        </button>
        <button
          className="mg-button primary"
          disabled={isObjectUpdating || disabled}
          onClick={handleSubmit}
        >
          Save
        </button>
      </DialogActions>
    </Dialog>
  );
}

EditImageSection.propTypes = {
  open: PropTypes.bool.isRequired,
  isHistoryCreating: PropTypes.bool.isRequired,
  isObjectUpdating: PropTypes.bool.isRequired,
  imageKey: PropTypes.string.isRequired,
  objectItem: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  sections: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  updateObject: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  isHistoryCreating: store.historyData.isCreating,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createHistory,
}, dispatch);
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditImageSection);
