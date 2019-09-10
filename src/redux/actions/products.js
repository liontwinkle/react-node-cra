/* eslint-disable import/prefer-default-export */
import productsService from 'services/products.service';
import types from '../actionTypes';

export const fetchProducts = () => (dispatch, getState) => {
  if (getState().productsData.isFetchingList) {
    return Promise.reject();
  }

  dispatch({
    type: types.PRODUCTS_GET_DATA_REQUEST,
  });

  const { client } = getState().clientsData;

  return productsService.fetch(client.id, 'products')
    .then((products) => {
      dispatch({
        type: types.PRODUCTS_GET_DATA_SUCCESS,
        payload: { products },
      });
    })
    .catch((error) => {
      dispatch({
        type: types.PRODUCTS_GET_DATA_FAIL,
        payload: { error },
      });
      throw error;
    });
};

export const updateProducts = updateData => (dispatch, getState) => {
  if (getState().productsData.isUpdatingList) {
    return Promise.reject();
  }

  console.log(updateData);// fixme
  dispatch({
    type: types.PRODUCTS_UPDATE_REQUEST,
  });

  const { client, type } = getState().clientsData;

  return productsService.update(client.id, type.key, updateData)
    .then((products) => {
      dispatch({
        type: types.PRODUCTS_UPDATE_SUCCESS,
        payload: { products },
      });
    })
    .catch((error) => {
      dispatch({
        type: types.PRODUCTS_UPDATE_FAIL,
        payload: { error },
      });
      throw error;
    });
};

export const setProducts = updateData => (dispatch) => {
  dispatch({
    type: types.PRODUCTS_SET_PRODUCTS,
    payload: { updateData },
  });
};
