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
  setProductViewType,
} from 'redux/actions/clients';
import { fetchCategories } from 'redux/actions/categories';
import { fetchPropertyField } from 'redux/actions/propertyFields';
import { fetchProductsField } from 'redux/actions/productsFields';
import { fetchAttributes } from 'redux/actions/attribute';
import { setProducts } from 'redux/actions/products';
import { CustomSelect } from 'components/elements';
import { productViewTypes, clientType } from 'utils/constants';
import { confirmMessage } from 'utils';

function ClientSelect({
  clients,
  client,
  type,
  productViewType,
  fetchClients,
  setClient,
  setClientType,
  setProductViewType,
  fetchCategories,
  fetchPropertyField,
  fetchProductsField,
  fetchAttributes,
  setProducts,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const defaultType = { key: 'virtual', label: 'Virtual' };

  useEffect(() => {
    fetchClients()
      .catch(() => {
        confirmMessage(enqueueSnackbar, 'Error in fetching clients.', 'error');
      });
  }, [fetchClients, enqueueSnackbar]);

  const items = clients.map(c => ({
    key: c.id,
    label: c.name,
  }));

  const actionChangeType = (type, client) => {
    setClientType(type);
    if (type.key !== 'products') {
      if (type.key === 'attributes') {
        fetchCategories(client.id, 'virtual');
        fetchAttributes(client.id, type.key);
      } else {
        fetchPropertyField(client.id, type.key);
        fetchCategories(client.id, type.key);
        fetchAttributes(client.id, 'attributes');
      }
    }
    fetchProductsField();
  };

  const handleChangeType = (type) => {
    actionChangeType(type, client);
  };

  const handleChangeProductViewType = (productViewType) => {
    setProductViewType(productViewType);
  };
  const handleChangeClient = (item) => {
    const newClient = _find(clients, { id: item.key });
    if (newClient) {
      setClient(newClient);
      setProducts([]);
      actionChangeType(defaultType, newClient);
    }
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
        <Fragment>
          <CustomSelect
            className="mr-3"
            placeholder="Select Type"
            value={type}
            items={clientType}
            onChange={handleChangeType}
          />
          {
            type.key === 'products'
            && (
              <CustomSelect
                className="mr-3"
                placeholder="Select View Method"
                value={productViewType}
                items={productViewTypes}
                onChange={handleChangeProductViewType}
              />
            )
          }
        </Fragment>
      )}
    </Fragment>
  );
}

ClientSelect.propTypes = {
  clients: PropTypes.array.isRequired,
  client: PropTypes.object,
  type: PropTypes.object,
  productViewType: PropTypes.object,
  fetchClients: PropTypes.func.isRequired,
  setClient: PropTypes.func.isRequired,
  setClientType: PropTypes.func.isRequired,
  setProductViewType: PropTypes.func.isRequired,
  fetchCategories: PropTypes.func.isRequired,
  fetchPropertyField: PropTypes.func.isRequired,
  fetchProductsField: PropTypes.func.isRequired,
  fetchAttributes: PropTypes.func.isRequired,
  setProducts: PropTypes.func.isRequired,
};

ClientSelect.defaultProps = {
  client: null,
  type: null,
  productViewType: null,
};

const mapStateToProps = store => ({
  clients: store.clientsData.clients,
  categories: store.categoriesData.categories,
  client: store.clientsData.client,
  type: store.clientsData.type,
  productViewType: store.clientsData.productViewType,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchClients,
  setClient,
  setClientType,
  setProductViewType,
  fetchCategories,
  fetchPropertyField,
  fetchProductsField,
  fetchAttributes,
  setProducts,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientSelect);
