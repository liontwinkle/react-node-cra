import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { useSnackbar } from 'notistack';
import isEqual from 'lodash/isEqual';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
} from '@material-ui/core';

import { confirmMessage, isExist, useStyles } from 'utils';
import { propertyFieldTypes } from 'utils/constants';
import { addNewRuleHistory } from 'utils/ruleManagement';
import { checkTemplate, checkPathValidate } from 'utils/propertyManagement';
import { updatePropertyField } from 'redux/actions/propertyFields';
import { updateDefaultOnCategory } from 'redux/actions/categories';
import { updateDefaultOnAttriute } from 'redux/actions/attribute';
import {
  CustomInput, CustomSelectWithLabel, CustomSearchFilter, CustomImageUpload,
} from 'components/elements';

function AddPropertyFields({
  open,
  isUpdating,
  objectItem,
  defaultOrder,
  handleClose,
  propertyField,
  updatePropertyField,
  updateDefaultOnCategory,
  updateDefaultOnAttriute,
  createHistory,
}) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const [propertyFieldData, setPropertyFieldData] = useState({
    key: '',
    label: '',
    default: '',
    template: '',
    propertyType: { key: 'string', label: 'String' },
    section: null,
    image: {
      name: '',
      path: '',
      type: '',
      imageData: null,
    },
    order: defaultOrder,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imageName, setImageName] = useState('');
  const handleChange = (field) => (e) => {
    const newClient = {
      ...propertyFieldData,
      [field]: e.target.value,
    };
    setPropertyFieldData(newClient);
  };

  const handleChangeTemplate = (field) => (value) => {
    const newClient = {
      ...propertyFieldData,
      [field]: value,
    };
    setPropertyFieldData(newClient);
  };

  const handleChangeType = (propertyType) => {
    const newClient = {
      ...propertyFieldData,
      propertyType,
    };
    setPropertyFieldData(newClient);
  };

  const handleChangeSection = (section) => {
    const newClient = {
      ...propertyFieldData,
      section,
    };
    setPropertyFieldData(newClient);
  };

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
              const newFile = {
                ...propertyFieldData,
                image: {
                  name: imageName,
                  path: file.name,
                  type: fileType,
                  imageData: reader.result,
                },
              };
              setPropertyFieldData(newFile);
            },
            false,
          );
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const disabled = !(propertyFieldData.key && propertyFieldData.label && propertyFieldData.propertyType);

  const handleSubmit = () => {
    const savedPropertyFieldData = JSON.parse(JSON.stringify(propertyFieldData));
    savedPropertyFieldData.image.name = imageName;
    if (!isUpdating && !disabled) {
      const propertyFields = JSON.parse(JSON.stringify(propertyField.propertyFields));
      const errList = checkTemplate(propertyFields, savedPropertyFieldData);
      const validatePath = checkPathValidate(propertyFields, savedPropertyFieldData);
      if (isExist(propertyFields, savedPropertyFieldData.key) === 0 && errList === '' && validatePath) {
        propertyFields.push({
          ...savedPropertyFieldData,
          propertyType: savedPropertyFieldData.propertyType.key,
          section: savedPropertyFieldData.section && savedPropertyFieldData.section.key,
        });
        const updateDefaultFunc = (objectItem.parentId !== undefined)
          ? updateDefaultOnCategory : updateDefaultOnAttriute;
        if (!isEqual(propertyField.propertyFields, propertyFields)) {
          updatePropertyField({ propertyFields })
            .then(() => {
              updateDefaultFunc(propertyFields)
                .then(() => {
                  addNewRuleHistory(createHistory, objectItem, objectItem.parentId,
                    `Create Property(${savedPropertyFieldData.propertyType.key})`,
                    `Create Property(${savedPropertyFieldData.propertyType.key}) by ${objectItem.name}`,
                    'virtual');
                  confirmMessage(enqueueSnackbar, 'Property field has been added successfully.', 'success');
                  handleClose();
                })
                .catch(() => {
                  confirmMessage(enqueueSnackbar, 'Error in updating the Properties default value .', 'error');
                });
            })
            .catch(() => {
              confirmMessage(enqueueSnackbar, 'Error in adding property field.', 'error');
            });
        } else {
          confirmMessage(enqueueSnackbar, 'The property is duplicated', 'info');
        }
      } else {
        let errMsg = '';
        if (errList !== '') {
          errMsg = `Templating Error: You are try to use unexpected keys. ${errList}`;
        } else if (validatePath) {
          errMsg = `Error: Another property is using the key (${savedPropertyFieldData.key}) you specified.`;
        } else {
          errMsg = 'URL Path is not valid.';
        }
        confirmMessage(enqueueSnackbar, errMsg, 'error');
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
        Add Property Fields
      </DialogTitle>

      <DialogContent className={`${classes.dialogContent} add-property-fields`}>
        <CustomInput
          className="mb-3"
          label="Key"
          inline
          value={propertyFieldData.key}
          onChange={handleChange('key')}
        />
        <CustomInput
          className="mb-3"
          label="Label"
          inline
          value={propertyFieldData.label}
          onChange={handleChange('label')}
        />
        <CustomSearchFilter
          className="mb-3"
          searchItems={
            propertyField.propertyFields.filter(
              (propertyItem) => (
                propertyItem.propertyType === 'string'
                || propertyItem.propertyType === 'text'
                || propertyItem.propertyType === 'monaco'
                || propertyItem.propertyType === 'richtext'
                || propertyItem.propertyType === 'urlpath'
              ),
            ).map((item) => (item.key))
          }
          placeholder="Input search filter"
          label="Default"
          value={propertyFieldData.default}
          onChange={handleChangeTemplate('default')}
        />
        <CustomSelectWithLabel
          className="mb-3"
          label="Type"
          inline
          value={propertyFieldData.propertyType}
          items={propertyFieldTypes}
          onChange={handleChangeType}
        />
        {
          (propertyFieldData.propertyType.key === 'string'
          || propertyFieldData.propertyType.key === 'text'
          || propertyFieldData.propertyType.key === 'urlpath'
          || propertyFieldData.propertyType.key === 'richtext'
          || propertyFieldData.propertyType.key === 'monaco')
          && (
            <CustomSearchFilter
              className="mb-3"
              searchItems={propertyField.propertyFields.map((item) => (item.key))}
              placeholder="Input search filter"
              label="Template"
              value={propertyFieldData.template}
              onChange={handleChangeTemplate('template')}
            />
          )
        }
        {
          propertyFieldData.propertyType.key === 'image'
            && (
              <CustomImageUpload
                className="mb-3"
                label="Image Upload"
                value={imageFile}
                name={imageName}
                onFileNameChange={handleChangeFileName}
                onChange={handleChangeImage}
              />
            )
        }
        <CustomInput
          className="mb-3"
          label="Order"
          type="number"
          min={1}
          inline
          value={propertyFieldData.order}
          onChange={handleChange('order')}
        />
        <CustomSelectWithLabel
          label="Section"
          inline
          value={propertyFieldData.section}
          items={propertyField.sections}
          onChange={handleChangeSection}
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
  defaultOrder: PropTypes.number.isRequired,
  propertyField: PropTypes.object.isRequired,
  objectItem: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  updatePropertyField: PropTypes.func.isRequired,
  updateDefaultOnCategory: PropTypes.func.isRequired,
  updateDefaultOnAttriute: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
};

const mapStateToProps = (store) => ({
  isUpdating: store.propertyFieldsData.isUpdating,
  propertyField: store.propertyFieldsData.propertyField,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  updatePropertyField,
  updateDefaultOnCategory,
  updateDefaultOnAttriute,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddPropertyFields);
