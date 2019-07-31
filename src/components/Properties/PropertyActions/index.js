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
import AddPropertyFields from './AddPropertyFields';
import EditPropertyFields from './EditPropertyFields';

function PropertyActions(props) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    properties,
    isUpdating,
    category,
    updateCategory,
  } = props;

  const [open, setOpen] = useState({ add: false, edit: false });
  const handleToggle = field => () => {
    setOpen({
      ...open,
      [field]: !open[field],
    });
  };

  const saveRules = properties => () => {
    if (category && !isUpdating) {
      updateCategory(category.id, { properties })
        .then(() => {
          enqueueSnackbar('Properties has been updated successfully.', { variant: 'success' });
        })
        .catch(() => {
          enqueueSnackbar('Error in updating properties.', { variant: 'error' });
        });
    }
  };

  return (
    <div className="mg-property-actions d-flex flex-column align-items-center">
      <Tooltip
        title="Add Property Fields"
        position="left"
        arrow
      >
        <IconButton disabled={!category} onClick={handleToggle('add')}>
          <AddIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Edit Property Fields"
        position="left"
        arrow
      >
        <IconButton disabled={!category} onClick={handleToggle('edit')}>
          <EditIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Save Properties"
        position="left"
        arrow
      >
        <IconButton disabled={isUpdating || !category} onClick={saveRules(properties)}>
          <SaveIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

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
  isUpdating: PropTypes.bool.isRequired,
  category: PropTypes.object,
  properties: PropTypes.object.isRequired,
  updateCategory: PropTypes.func.isRequired,
};

PropertyActions.defaultProps = {
  category: null,
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
