import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { useSnackbar } from 'notistack';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import { Tooltip } from 'react-tippy';

import { updateAttribute } from 'redux/actions/attribute';
import { IconButton } from 'components/elements';
import { confirmMessage } from 'utils';
import AddSections from './AddSections';
import EditSections from './EditSections';
import AddPropertyFields from './AddPropertyFields';
import EditPropertyFields from './EditPropertyFields';

function PropertyActions({
  properties,
  isUpdating,
  attribute,
  updateAttribute,
  fields,
}) {
  const { enqueueSnackbar } = useSnackbar();

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
        || tempProperties[item.key] === undefined
      ) {
        delete tempProperties[item.key];
      } else if (item.propertyType === 'array') {
        let chkFlag = true;
        try {
          tempProperties[item.key] = JSON.parse(tempProperties[item.key]);
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
        updateAttribute(attribute.id, { properties: saveData })
          .then(() => {
            confirmMessage(enqueueSnackbar, 'Properties has been updated successfully.', 'success');
          })
          .catch(() => {
            confirmMessage(enqueueSnackbar, 'Error in updating properties.', 'error');
          });
      }
    } else {
      confirmMessage(enqueueSnackbar, 'Input format is wrong.', 'error');
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
  attribute: PropTypes.object.isRequired,
  updateAttribute: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  isUpdating: store.attributesData.isUpdating,
  attribute: store.attributesData.attribute,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  updateAttribute,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PropertyActions);
