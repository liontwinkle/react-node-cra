import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import PropTypes from 'prop-types';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import CopyIcon from '@material-ui/icons/CloudUpload';
import PreviewIcon from '@material-ui/icons/Laptop';

import { IconButton } from 'components/elements';
// import PreviewSection from 'components/PreviewSection';
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

  const [formState, setFormState] = useState({
    Add: false,
    Edit: false,
    Type: false,
    Preview: false,
  });
  const handleOpen = (type) => () => {
    if (!disabled) {
      setFormState({ open: true, type });
    }
  };
  const handleClose = (type) => () => {
    setFormState({
      ...formState,
      [type]: false,
    });
  };

  return (
    <>
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
        <>
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
        </>
      )}
      {type && (
        <>
          <Tooltip
            title={`Import Data for ${type.label}`}
            position="bottom"
            arrow
          >
            <IconButton className="mx-2" onClick={handleOpen('Type')}>
              <CopyIcon style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
          <Tooltip
            title="Click to Preview."
            position="bottom"
            arrow
          >
            <IconButton className="mx-2" onClick={handleOpen('Preview')}>
              <PreviewIcon style={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </>
      )}
      {formState.Add && (
        <ClientForm status={formState} handleClose={handleClose('Add')} />
      )}
      {formState.Edit && (
        <ClientForm status={formState} handleClose={handleClose('Edit')} />
      )}
      {formState.Type && (
        <ClientImport status={formState} handleClose={handleClose('Type')} client={client} type={type} />
      )}
      {/* {formState.Preview && ( */}
      {/* <PreviewSection open={formState.Preview} handleClose={handleClose('Preview')} type={type} /> */}
      {/* )} */}
    </>
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

const mapStateToProps = (store) => ({
  client: store.clientsData.client,
  type: store.clientsData.type,
  isFetchingProducts: store.productsData.isFetchingList,
  isFetchingCategories: store.categoriesData.isFetchingList,
  isFetchingAttributes: store.attributesData.isFetchingList,
});

export default connect(mapStateToProps)(ClientAction);
