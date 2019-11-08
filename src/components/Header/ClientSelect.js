import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import _find from 'lodash/find';
import { useSnackbar } from 'notistack';

import {
  fetchClients,
  setClient,
  setClientType,
  setProductViewType,
} from 'redux/actions/clients';
import { fetchCategories, updateTreeData } from 'redux/actions/categories';
import { fetchPropertyField } from 'redux/actions/propertyFields';
import { fetchProductsField } from 'redux/actions/productsFields';
import { fetchAttributes, updateNodeData, setAttribute } from 'redux/actions/attribute';
import { fetchHistories } from 'redux/actions/history';
import { setProducts } from 'redux/actions/products';
import { CustomSelect } from 'components/elements';
import { productViewTypes, clientType } from 'utils/constants';
import { confirmMessage } from 'utils';

function ClientSelect({
  clients,
  client,
  type,
  isFetchingProducts,
  isFetchingAttributes,
  isFetchingCategories,
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
  setAttribute,
  updateTreeData,
  updateNodeData,
  fetchHistories,
}) {
  const { enqueueSnackbar } = useSnackbar();

  const defaultType = { key: 'virtual', label: 'Virtual' };

  useEffect(() => {
    fetchClients()
      .catch(() => { confirmMessage(enqueueSnackbar, 'Error in fetching clients.', 'error'); });
  }, [fetchClients, enqueueSnackbar]);

  const items = clients.map((c) => ({ key: c.id, label: c.name }));

  const actionChangeType = (type, client) => {
    setClientType(type);
    if (type.key !== 'products') {
      fetchPropertyField(client.id, type.key);
      const fetchType = (type.key === 'native') ? 'virtual' : type.key;
      fetchHistories(client.id, fetchType);
      if (type.key === 'attributes') {
        fetchCategories(client.id, 'virtual');
        setAttribute(null);
        fetchAttributes(client.id, type.key);
      } else {
        fetchCategories(client.id, type.key);
        fetchAttributes(client.id, 'attributes');
      }
    }
    fetchProductsField();
  };

  const handleChangeType = (type) => { actionChangeType(type, client); };

  const handleChangeProductViewType = (productViewType) => {
    setProductViewType(productViewType);
  };
  const handleChangeClient = (item) => {
    const newClient = _find(clients, { id: item.key });
    if (newClient) {
      setClient(newClient);
      setProducts([]);
      updateNodeData([]);
      updateTreeData([]);
      actionChangeType(defaultType, newClient);
    }
  };

  const current = client ? { key: client.id, label: client.name } : null;
  const disabled = (isFetchingAttributes || isFetchingCategories || isFetchingProducts);
  return (
    <>
      {clients && clients.length > 0 && (
        <CustomSelect
          className="mr-3"
          placeholder="Select Client"
          value={current}
          items={items}
          onChange={handleChangeClient}
          disabled={disabled}
        />
      )}

      {client && (
        <>
          <CustomSelect
            className="mr-3"
            placeholder="Select Type"
            value={type}
            items={clientType}
            onChange={handleChangeType}
            disabled={disabled}
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
                disabled={disabled}
              />
            )
          }
        </>
      )}
    </>
  );
}

ClientSelect.propTypes = {
  clients: PropTypes.array.isRequired,
  isFetchingProducts: PropTypes.bool.isRequired,
  isFetchingCategories: PropTypes.bool.isRequired,
  isFetchingAttributes: PropTypes.bool.isRequired,
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
  setAttribute: PropTypes.func.isRequired,
  updateTreeData: PropTypes.func.isRequired,
  updateNodeData: PropTypes.func.isRequired,
  fetchHistories: PropTypes.func.isRequired,
};

ClientSelect.defaultProps = {
  client: null,
  type: null,
  productViewType: null,
};

const mapStateToProps = (store) => ({
  clients: store.clientsData.clients,
  categories: store.categoriesData.categories,
  client: store.clientsData.client,
  type: store.clientsData.type,
  productViewType: store.clientsData.productViewType,
  isFetchingProducts: store.productsData.isFetchingList,
  isFetchingCategories: store.categoriesData.isFetchingList,
  isFetchingAttributes: store.attributesData.isFetchingList,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchClients,
  setClient,
  setClientType,
  setProductViewType,
  fetchCategories,
  fetchPropertyField,
  fetchProductsField,
  fetchAttributes,
  fetchHistories,
  setProducts,
  setAttribute,
  updateTreeData,
  updateNodeData,
}, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ClientSelect);
