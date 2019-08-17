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

  const { client, type } = getState().clientsData;
  return productsService.fetch(client.id, type.key)
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
