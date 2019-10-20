import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import CopyIcon from '@material-ui/icons/CloudUpload';

import { IconButton } from 'components/elements';
import ClientRemove from './ClientRemove';
import ClientForm from './ClientForm';
import ClientImport from './ClientImport';

function ClientAction(props) {
  const {
    client,
    type,
    isFetchingProducts,
    isFetchingAttributes,
    isFetchingCategories,
  } = props;

  const disabled = (isFetchingAttributes || isFetchingCategories || isFetchingProducts);

  const [formState, setFormState] = useState({ open: false, type: '' });
  const handleOpen = type => () => {
    if (!disabled) {
      setFormState({ open: true, type });
    }
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
            <IconButton className="mx-2" onClick={handleOpen('Edit')}>
              <EditIcon style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          <ClientRemove disabled={disabled} />
        </Fragment>
      )}
      {type && (
        <Tooltip
          title={`Import Data for ${type.label}`}
          position="bottom"
          arrow
        >
          <IconButton className="mx-2" onClick={handleOpen('Type')}>
            <CopyIcon style={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      )}
      {formState.open && (
        formState.type === 'Type'
          ? <ClientImport status={formState} handleClose={handleClose} client={client} type={type} />
          : <ClientForm status={formState} handleClose={handleClose} />
      )}
    </Fragment>
  );
}

ClientAction.propTypes = {
  client: PropTypes.object,
  type: PropTypes.object,
  isFetchingProducts: PropTypes.bool.isRequired,
  isFetchingCategories: PropTypes.bool.isRequired,
  isFetchingAttributes: PropTypes.bool.isRequired,
};

ClientAction.defaultProps = {
  client: null,
  type: null,
};

const mapStateToProps = store => ({
  client: store.clientsData.client,
  type: store.clientsData.type,
  isFetchingProducts: store.productsData.isFetchingList,
  isFetchingCategories: store.categoriesData.isFetchingList,
  isFetchingAttributes: store.attributesData.isFetchingList,
});

export default connect(mapStateToProps)(ClientAction);
