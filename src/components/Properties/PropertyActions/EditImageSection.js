import React, { useState } from 'react';
import PropTypes from 'prop-types';

// import { useSnackbar } from 'notistack';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
} from '@material-ui/core';

import { useStyles } from 'utils';
import { CustomImageUpload } from 'components/elements';

function EditImageSection({
  open,
  isObjectUpdating,
  // updateObject,
  imageKey,
  objectItem,
  handleClose,
}) {
  const classes = useStyles();
  // const { enqueueSnackbar } = useSnackbar();

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
    savedProperties[imageKey] = JSON.stringify(imageUpdateData);
    if (!isObjectUpdating && !disabled) {
      console.log('##### DEBUG SAVED PROPERTIES: ', savedProperties);
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
  imageKey: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  isObjectUpdating: PropTypes.bool.isRequired,
  objectItem: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  // updateObject: PropTypes.func.isRequired,
};

export default EditImageSection;
