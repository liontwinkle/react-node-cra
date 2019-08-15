/* eslint-disable import/prefer-default-export */
import productsService from 'services/products.service';
import types from '../actionTypes';

export const fetchProducts = index => (dispatch, getState) => {
  if (getState().productsData.isFetchingList) {
    return Promise.reject();
  }

  dispatch({
    type: types.PRODUCTS_GET_DATA_REQUEST,
  });

  const { client, type } = getState().clientsData;
  console.log('recev request>>> Index', index);// fixme
  return productsService.fetch(client.id, type.key, index)
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
