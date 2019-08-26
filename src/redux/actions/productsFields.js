import productsFieldsService from 'services/productsFields.service';
import types from '../actionTypes';

export const fetchProductsField = () => (dispatch, getState) => {
  if (getState().productsFieldsData.isFetchingList) {
    return Promise.reject();
  }
  const { client } = getState().clientsData;
  dispatch({
    type: types.PRODUCTS_GET_FIELDS_REQUEST,
  });
  return productsFieldsService.fetch(client.id)
    .then((productsField) => {
      dispatch({
        type: types.PRODUCTS_GET_FIELDS_SUCCESS,
        payload: { productsField },
      });
    })
    .catch((error) => {
      dispatch({
        type: types.PRODUCTS_GET_FIELDS_FAIL,
        payload: { error },
      });
      throw error;
    });
};

export const updateProductsField = updatedData => (dispatch, getState) => {
  if (getState().productsFieldsData.isUpdating) {
    return;
  }
  const { client } = getState().clientsData;
  dispatch({
    type: types.PRODUCTS_UPDATE_FIELDS_REQUEST,
  });
  return productsFieldsService.update(client.id, updatedData)
    .then((data) => {
      dispatch({
        type: types.PRODUCTS_UPDATE_FIELDS_SUCCESS,
        payload: { data },
      });
      return 'success';
    })
    .catch((error) => {
      dispatch({
        type: types.PRODUCTS_UPDATE_FIELDS_FAIL,
        payload: { error },
      });
      throw error;
    });
};

export const removeProductsField = () => (dispatch, getState) => {
  if (getState().productsFieldsData.isDeleting) {
    return;
  }
  const { client } = getState().clientsData;
  dispatch({
    type: types.PRODUCTS_DELETE_FIELDS_REQUEST,
  });
  return productsFieldsService.remove(client.id)
    .then(() => {
      dispatch({
        type: types.PRODUCTS_DELETE_FIELDS_SUCCESS,
      });
      return 'success';
    })
    .catch((error) => {
      dispatch({
        type: types.PRODUCTS_DELETE_FIELDS_FAIL,
        payload: { error },
      });
      throw error;
    });
};
