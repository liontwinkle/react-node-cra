import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { Tooltip } from 'react-tippy';

import { IconButton } from 'components/elements';
import ClientRemove from './ClientRemove';
import ClientForm from './ClientForm';

function ClientAction(props) {
  const { client } = props;

  const [formState, setFormState] = useState({ open: false, type: '' });
  const handleOpen = type => () => {
    setFormState({
      open: true,
      type,
    });
  };
  const handleClose = () => {
    setFormState({
      ...formState,
      open: false,
    });
  };

  return (
    <Fragment>
      <Tooltip
        title="Add Client"
        position="bottom"
        arrow
      >
        <IconButton onClick={handleOpen('Add')}>
          <AddIcon />
        </IconButton>
      </Tooltip>

      {client && (
        <Fragment>
          <Tooltip
            title="Edit Client"
            position="bottom"
            arrow
          >
            <IconButton
              className="mx-2"
              onClick={handleOpen('Edit')}
            >
              <EditIcon style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          <ClientRemove />
        </Fragment>
      )}

      {formState.open && (
        <ClientForm status={formState} handleClose={handleClose} />
      )}
    </Fragment>
  );
}

ClientAction.propTypes = {
  client: PropTypes.object,
};

ClientAction.defaultProps = {
  client: null,
};

const mapStateToProps = store => ({
  client: store.clientsData.client,
});

export default connect(mapStateToProps)(ClientAction);
