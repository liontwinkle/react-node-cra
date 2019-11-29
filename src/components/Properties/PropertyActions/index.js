import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import { useSnackbar } from 'notistack';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

import { confirmMessage, getMaxValueFromArray } from 'utils';
import { addNewRuleHistory } from 'utils/ruleManagement';
import { setDefault, makeUpdatedData } from 'utils/propertyManagement';
import { IconButton } from 'components/elements';
import { bindActionCreators } from 'redux';
import { createHistory } from 'redux/actions/history';
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
  sections,
  uploadImage,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState({
    add: false,
    edit: false,
    add_section: false,
    edit_section: false,
    default: false,
  });

  const [sortHistory, setSortHistory] = useState({
    property: {
      index: 0,
      direction: 'asc',
    },
    section: {
      index: 0,
      direction: 'asc',
    },
  });

  const [pageNum, setPageNum] = useState({
    section: 10,
    property: 20,
  });

  const onChangePageNum = (field) => (page) => {
    setPageNum({
      ...pageNum,
      [field]: page,
    });
  };

  const onChangeOrder = (field) => (index, direction) => {
    setSortHistory({
      ...sortHistory,
      [field]: {
        index,
        direction,
      },
    });
  };
  const handleToggle = (field) => () => {
    setOpen({
      ...open,
      [field]: !open[field],
    });
  };

  const saveProperties = () => {
    const saveData = setDefault(properties, fields);
    if (saveData.errMsg === '') {
      if (!isObjectUpdating && !isHistoryCreating) {
        if (!isEqual(objectItem.properties, saveData.tempProperties)) {
          const updatedData = makeUpdatedData(saveData.tempProperties, fields, sections);
          const parenId = (objectItem.group_id) ? objectItem.group_id : objectItem.parent_id;
          updateObject(objectItem._id, { properties: updatedData })
            .then(() => {
              addNewRuleHistory(createHistory, objectItem, parenId,
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
        <AddSections
          open={open.add_section}
          handleClose={handleToggle('add_section')}
          defaultOrder={getMaxValueFromArray('order', sections) + 1}
        />
      )}

      {open.edit_section && (
        <EditSections
          open={open.edit_section}
          order={sortHistory.section}
          pageNum={pageNum.section}
          handleClose={handleToggle('edit_section')}
          onChangeOrder={onChangeOrder('section')}
          onChangePageNum={onChangePageNum('section')}
        />
      )}

      {open.add && (
        <AddPropertyFields
          open={open.add}
          handleClose={handleToggle('add')}
          createHistory={createHistory}
          objectItem={objectItem}
          uploadImage={uploadImage}
          defaultOrder={getMaxValueFromArray('order', fields) + 1}
        />
      )}

      {open.edit && (
        <EditPropertyFields
          open={open.edit}
          handleClose={handleToggle('edit')}
          createHistory={createHistory}
          objectItem={objectItem}
          order={sortHistory.property}
          pageNum={pageNum.property}
          onChangeOrder={onChangeOrder('property')}
          onChangePageNum={onChangePageNum('property')}
        />
      )}
    </div>
  );
}

PropertyActions.propTypes = {
  isObjectUpdating: PropTypes.bool.isRequired,
  isHistoryCreating: PropTypes.bool.isRequired,
  properties: PropTypes.object.isRequired,
  objectItem: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  sections: PropTypes.array.isRequired,
  updateObject: PropTypes.func.isRequired,
  createHistory: PropTypes.func.isRequired,
  uploadImage: PropTypes.any,
};

PropertyActions.defaultProps = {
  uploadImage: null,
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
)(PropertyActions);
