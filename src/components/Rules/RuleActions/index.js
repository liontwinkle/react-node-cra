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
import AddRuleKeys from './AddRuleKeys';
import EditRuleKeys from './EditRuleKeys';

function RuleActions(props) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    json,
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

  const saveRules = rules => () => {
    if (category && !isUpdating) {
      updateCategory(category.id, { rules })
        .then(() => {
          enqueueSnackbar('Rules has been updated successfully.', { variant: 'success' });
        })
        .catch(() => {
          enqueueSnackbar('Error in updating rules.', { variant: 'error' });
        });
    }
  };

  return (
    <div className="mg-rule-actions d-flex flex-column align-items-center">
      <Tooltip
        title="Add Rule Keys"
        position="left"
        arrow
      >
        <IconButton disabled={!category} onClick={handleToggle('add')}>
          <AddIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Edit Rule Keys"
        position="left"
        arrow
      >
        <IconButton disabled={!category} onClick={handleToggle('edit')}>
          <EditIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Save Rules"
        position="left"
        arrow
      >
        <IconButton disabled={isUpdating || !category} onClick={saveRules(json)}>
          <SaveIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      {open.add && (
        <AddRuleKeys open={open.add} handleClose={handleToggle('add')} />
      )}

      {open.edit && (
        <EditRuleKeys open={open.edit} handleClose={handleToggle('edit')} />
      )}
    </div>
  );
}

RuleActions.propTypes = {
  isUpdating: PropTypes.bool.isRequired,
  category: PropTypes.object,
  json: PropTypes.object.isRequired,
  updateCategory: PropTypes.func.isRequired,
};

RuleActions.defaultProps = {
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
)(RuleActions);
