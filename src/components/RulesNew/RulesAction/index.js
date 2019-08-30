import React, { useState } from 'react';
// import PropTypes from 'prop-types';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';

import { Tooltip } from 'react-tippy';

import { IconButton } from 'components/elements';
import './style.scss';
import AddSections from '../../Properties/PropertyActions/AddSections';
import EditSections from '../../Properties/PropertyActions/EditSections';

function RulesAction() {
  const [open, setOpen] = useState({
    add_rule: false,
    edit_rules: false,
  });
  const handleToggle = field => () => {
    setOpen({
      ...open,
      [field]: !open[field],
    });
  };
  return (
    <div className="mg-rules-actions d-flex align-items-left">
      <Tooltip
        title="Add New Rule"
        position="top"
        arrow
      >
        <IconButton onClick={handleToggle('add_rule')}>
          <AddIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Edit Rules"
        position="top"
        arrow
      >
        <IconButton onClick={handleToggle('edit_rules')}>
          <EditIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
      {open.add_rule && (
        <AddSections open={open.add_rule} handleClose={handleToggle('add_rule')} />
      )}

      {open.edit_rules && (
        <EditSections open={open.edit_rules} handleClose={handleToggle('edit_rules')} />
      )}
    </div>
  );
}

export default RulesAction;
