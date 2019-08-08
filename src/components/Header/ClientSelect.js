import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import _find from 'lodash/find';
import { useSnackbar } from 'notistack';

import {
  fetchClients,
  setClient,
  setClientType,
} from 'redux/actions/clients';
import { fetchCategories } from 'redux/actions/categories';
import { CustomSelect } from 'components/elements';
import { fetchPropertyField } from 'redux/actions/propertyFields';

const types = [
  { key: 'virtual', label: 'Virtual' },
  { key: 'native', label: 'Native' },
  { key: 'products', label: 'Products' },
  { key: 'attributes', label: 'Attributes' },
];

function ClientSelect(props) {
  const { enqueueSnackbar } = useSnackbar();

  const {
    clients,
    client,
    type,
    fetchClients,
    setClient,
    setClientType,
    fetchCategories,
    fetchPropertyField,
  } = props;

  useEffect(() => {
    fetchClients()
      .catch(() => {
        enqueueSnackbar('Error in fetching clients.', { variant: 'error', autoHideDuration: 1000 });
      });
  }, [fetchClients, enqueueSnackbar]);

  const items = clients.map(c => ({
    key: c.id,
    label: c.name,
  }));

  const handleChangeClient = (item) => {
    const newClient = _find(clients, { id: item.key });
    if (newClient) {
      setClient(newClient);
    }
  };

  const handleChangeType = (type) => {
    setClientType(type);
    fetchCategories(client.id, type.key);
    fetchPropertyField(client.id, type.key);
  };

  const current = client ? { key: client.id, label: client.name } : null;

  return (
    <Fragment>
      {clients && clients.length > 0 && (
        <CustomSelect
          className="mr-3"
          placeholder="Select Client"
          value={current}
          items={items}
          onChange={handleChangeClient}
        />
      )}

      {client && (
        <CustomSelect
          className="mr-3"
          placeholder="Select Type"
          value={type}
          items={types}
          onChange={handleChangeType}
        />
      )}
    </Fragment>
  );
}

ClientSelect.propTypes = {
  clients: PropTypes.array.isRequired,
  client: PropTypes.object,
  type: PropTypes.object,
  fetchClients: PropTypes.func.isRequired,
  setClient: PropTypes.func.isRequired,
  setClientType: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  fetchPropertyField: PropTypes.func.isRequired,
};

ClientSelect.defaultProps = {
  client: null,
  type: null,
};

const mapStateToProps = store => ({
  clients: store.clientsData.clients,
  client: store.clientsData.client,
  type: store.clientsData.type,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchClients,
  setClient,
  setClientType,
  fetchCategories,
  fetchPropertyField,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientSelect);
