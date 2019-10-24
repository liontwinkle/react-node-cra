import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useSnackbar } from 'notistack';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

import { confirmMessage } from 'utils';
import { addNewRuleHistory } from 'utils/ruleManagement';
import { setDefault } from 'utils/propertyManagement';
import { IconButton } from 'components/elements';
import AddSections from './AddSections';
import EditSections from './EditSections';
import AddPropertyFields from './AddPropertyFields';
import EditPropertyFields from './EditPropertyFields';

function PropertyActions({
  properties,
  isObjectUpdating,
  objectItem,
  isHistoryCreating,
  updateObject,
  createHistory,
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

  const saveProperties = () => {
    const saveData = setDefault(properties, fields);
    if (saveData.chkFlag) {
      if (!isObjectUpdating && !isHistoryCreating) {
        if (!isEqual(objectItem.properties, saveData)) {
          updateObject(objectItem.id, { properties: saveData })
            .then(() => {
              addNewRuleHistory(createHistory, objectItem, objectItem.parentId,
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
        <IconButton disabled={isObjectUpdating} onClick={handleToggle('add_section')}>
          <AddIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Edit Sections"
        position="left"
        arrow
      >
        <IconButton disabled={isObjectUpdating} onClick={handleToggle('edit_section')}>
          <EditIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <div className="divider" />

      <Tooltip
        title="Add Property Field"
        position="left"
        arrow
      >
        <IconButton disabled={isObjectUpdating} onClick={handleToggle('add')}>
          <AddIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Edit Property Fields"
        position="left"
        arrow
      >
        <IconButton disabled={isObjectUpdating} onClick={handleToggle('edit')}>
          <EditIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <div className="divider" />

      <Tooltip
        title="Save Properties"
        position="left"
        arrow
      >
        <IconButton disabled={isObjectUpdating} onClick={saveProperties}>
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
        <AddPropertyFields
          open={open.add}
          handleClose={handleToggle('add')}
          createHistory={createHistory}
          objectItem={objectItem}
        />
      )}

      {open.edit && (
        <EditPropertyFields
          open={open.edit}
          handleClose={handleToggle('edit')}
          createHistory={createHistory}
          objectItem={objectItem}
        />
      )}
    </div>
  );
}

PropertyActions.propTypes = {
  properties: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  isObjectUpdating: PropTypes.bool.isRequired,
  isHistoryCreating: PropTypes.bool.isRequired,
  objectItem: PropTypes.object.isRequired,
  updateObject: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
};

const mapStateToProps = store => ({
  isHistoryCreating: store.historyData.isCreating,
});

export default connect(
  mapStateToProps,
)(PropertyActions);
