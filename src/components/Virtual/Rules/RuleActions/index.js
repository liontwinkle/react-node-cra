import React, { useState } from 'react';
import { Tooltip } from 'react-tippy';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { useSnackbar } from 'notistack';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

import { updateCategory } from 'redux/actions/categories';
import { IconButton } from 'components/elements/index';
import { confirmMessage } from 'utils';
import AddRuleKeys from './AddRuleKeys';
import EditRuleKeys from './EditRuleKeys';

function RuleActions(props) {
  const { enqueueSnackbar } = useSnackbar();
  const {
    rules,
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

  const saveRules = () => {
    if (!isUpdating) {
      updateCategory(category.id, { rules })
        .then(() => {
          confirmMessage(enqueueSnackbar, 'Rules has been updated successfully.', 'success');
        })
        .catch(() => {
          confirmMessage(enqueueSnackbar, 'Error in updating rules.', 'error');
        });
    }
  };

  return (
    <div className="mg-rule-actions d-flex flex-column align-items-center">
      <Tooltip
        title="Add Rule Key"
        position="left"
        arrow
      >
        <IconButton disabled={isUpdating} onClick={handleToggle('add')}>
          <AddIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Tooltip
        title="Edit Rule Keys"
        position="left"
        arrow
      >
        <IconButton disabled={isUpdating} onClick={handleToggle('edit')}>
          <EditIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <div className="divider" />

      <Tooltip
        title="Save Rules"
        position="left"
        arrow
      >
        <IconButton disabled={isUpdating} onClick={saveRules}>
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
  category: PropTypes.object.isRequired,
  rules: PropTypes.object.isRequired,
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
)(RuleActions);
