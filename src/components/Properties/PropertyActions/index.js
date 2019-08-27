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
    default: false,
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
      if (
        tempProperties[item.key] === item.default
        || tempProperties[item.key] === (item.default === 'true')
        || tempProperties[item.key] === ''
      ) {
        delete tempProperties[item.key];
      } else if (item.propertyType === 'array') {
        let chkFlag = true;
        try {
          const newData = JSON.parse(tempProperties[item.key]);
          tempProperties[item.key] = newData;
        } catch (e) {
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
                autoHideDuration: 1500,
              });
          })
          .catch(() => {
            enqueueSnackbar('Error in updating properties.',
              {
                variant: 'error',
                autoHideDuration: 4000,
              });
          });
      }
    } else {
      enqueueSnackbar('Input format is wrong.',
        {
          variant: 'error',
          autoHideDuration: 4000,
        });
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
