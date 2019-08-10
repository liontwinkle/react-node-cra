import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { Tooltip } from 'react-tippy';

import { updateCategory } from 'redux/actions/categories';
import { IconButton } from 'components/elements';
import AddSections from './AddSections';
import EditSections from './EditSections';
import AddPropertyFields from './AddPropertyFields';
import EditPropertyFields from './EditPropertyFields';

function PropertyActions(props) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    properties,
    isUpdating,
    category,
    updateCategory,
    fields,
  } = props;

  const [open, setOpen] = useState({
    add: false,
    edit: false,
    add_section: false,
    edit_section: false,
  });
  const handleToggle = field => () => {
    setOpen({
      ...open,
      [field]: !open[field],
    });
  };

  const setDefault = () => {
    const tempProperties = properties;
    tempProperties.chkFlag = true;
    fields.forEach((item) => {
      if (!tempProperties[item.key]) {
        switch (item.propertyType) {
          case 'string':
            tempProperties[item.key] = 'Name';
            break;
          case 'toggle':
            tempProperties[item.key] = false;
            break;
          case 'text':
            tempProperties[item.key] = 'Text';
            break;
          case 'array':
            tempProperties[item.key] = [
              1, 2, 3, 4,
            ];
            break;
          default:
            break;
        }
      } else if (item.propertyType === 'array') {
        let string = '';
        let chkFlag = true;
        if (Array.isArray(tempProperties[item.key])) {
          string = JSON.stringify(tempProperties[item.key]);
        } else {
          string = tempProperties[item.key];
        }

        const stringData = string.match((/"\w+"/g));
        const arrayData = string.split(',');
        console.log(arrayData);// fixme
        const numberData = string.match((/[0-9]\w+/g));
        console.log(stringData);
        if (arrayData
          && stringData
          && (arrayData.length !== stringData.length)) {
          chkFlag = false;
        }
        if (stringData) {
          if (stringData.length > 1) {
            const tempData = [];
            stringData.forEach((item) => {
              tempData.push(item.slice(1, item.length - 1));
              if (arrayData.length !== stringData.length) {
                chkFlag = false;
              }
            });
            tempProperties[item.key] = tempData;
          } else if (stringData.length === 1) {
            const tempData = [stringData[0].slice(1, stringData[0].length - 1)];
            tempProperties[item.key] = tempData;
          }
        } else if (arrayData) {
          const temp = [];
          arrayData[0] = arrayData[0].replace('[', '');
          arrayData.forEach((item) => {
            if (parseInt(item, 10)) {
              temp.push(parseInt(item, 10));
            } else {
              chkFlag = false;
            }
          });
          tempProperties[item.key] = temp;
          console.log(numberData);
          chkFlag = true;
        } else {
          chkFlag = false;
        }
        tempProperties.chkFlag = chkFlag;
      }
    });
    return tempProperties;
  };

  const saveProperties = () => {
    const saveData = setDefault();
    if (saveData.chkFlag) {
      if (!isUpdating) {
        updateCategory(category.id, { properties: saveData })
          .then(() => {
            enqueueSnackbar('Properties has been updated successfully.',
              {
                variant: 'success',
                autoHideDuration: 1000,
              });
          })
          .catch(() => {
            enqueueSnackbar('Error in updating properties.', { variant: 'error', autoHideDuration: 1000 });
          });
      }
    } else {
      enqueueSnackbar('Input format is wrong.', { variant: 'error', autoHideDuration: 1000 });
    }
  };

  return (
    <div className="mg-property-actions d-flex flex-column align-items-center">
      <Tooltip
        title="Add Section"
        position="left"
        arrow
      >
        <IconButton disabled={isUpdating} onClick={handleToggle('add_section')}>
          <AddIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Edit Sections"
        position="left"
        arrow
      >
        <IconButton disabled={isUpdating} onClick={handleToggle('edit_section')}>
          <EditIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <div className="divider" />

      <Tooltip
        title="Add Property Field"
        position="left"
        arrow
      >
        <IconButton disabled={isUpdating} onClick={handleToggle('add')}>
          <AddIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Edit Property Fields"
        position="left"
        arrow
      >
        <IconButton disabled={isUpdating} onClick={handleToggle('edit')}>
          <EditIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <div className="divider" />

      <Tooltip
        title="Save Properties"
        position="left"
        arrow
      >
        <IconButton disabled={isUpdating} onClick={saveProperties}>
          <SaveIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      {open.add_section && (
        <AddSections open={open.add_section} handleClose={handleToggle('add_section')} />
      )}

      {open.edit_section && (
        <EditSections open={open.edit_section} handleClose={handleToggle('edit_section')} />
      )}

      {open.add && (
        <AddPropertyFields open={open.add} handleClose={handleToggle('add')} />
      )}

      {open.edit && (
        <EditPropertyFields open={open.edit} handleClose={handleToggle('edit')} />
      )}
    </div>
  );
}

PropertyActions.propTypes = {
  properties: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  isUpdating: PropTypes.bool.isRequired,
  category: PropTypes.object.isRequired,
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
)(PropertyActions);
