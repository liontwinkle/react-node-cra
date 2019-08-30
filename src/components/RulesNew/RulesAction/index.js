import React from 'react';
// import PropTypes from 'prop-types';

import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

import { Tooltip } from 'react-tippy';

import { IconButton } from 'components/elements';
import './style.scss';

function RulesAction() {
  return (
    <div className="mg-rules-actions d-flex align-items-left">
      <Tooltip
        title="Add New Rule"
        position="top"
        arrow
      >
        <IconButton>
          <AddIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Edit Rules"
        position="top"
        arrow
      >
        <IconButton>
          <EditIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
      <Tooltip
        title="Save Rules"
        position="top"
        arrow
      >
        <IconButton>
          <SaveIcon style={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
    </div>
  );
}

export default RulesAction;
