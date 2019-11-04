import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

// import { useSnackbar } from 'notistack';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
} from '@material-ui/core';

import { useStyles } from 'utils';
import { updatePropertyField } from 'redux/actions/propertyFields';
import { updateDefaultOnCategory } from 'redux/actions/categories';
import { updateDefaultOnAttriute } from 'redux/actions/attribute';
import { CustomImageUpload } from 'components/elements';

function EditImageSection({
  open,
  isUpdating,
  key,
  // value,
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
    setImage({
      ...image,
      name: e.target.value,
    });
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

  const disabled = !(imageName !== '' && imageFile.length > 0);

  const handleSubmit = () => {
    const savedProperties = JSON.parse(JSON.stringify(objectItem.properties));
    savedProperties[key] = JSON.stringify(image);
    if (!isUpdating && !disabled) {
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

EditImageSection.propTypes = {
  key: PropTypes.string.isRequired,
  // value: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  objectItem: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  isUpdating: store.propertyFieldsData.isUpdating,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updatePropertyField,
  updateDefaultOnCategory,
  updateDefaultOnAttriute,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditImageSection);
