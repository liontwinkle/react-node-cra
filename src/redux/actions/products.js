/* eslint-disable import/prefer-default-export */
import productsService from 'services/products.service';
import types from '../actionTypes';

export const fetchProducts = (clientId, type, index) => (dispatch, getState) => {
  if (getState().productsData.isFetchingList) {
    return Promise.reject();
  }

  dispatch({
    type: types.PRODUCTS_GET_DATA_REQUEST,
  });

  console.log('recev request CLID>>>', clientId,
    'recev request TYPE>>>', type,
    'recev request>>> Index', index);// fixme
  return productsService.fetch(clientId, type, index)
    .then((categories) => {
      dispatch({
        type: types.PRODUCTS_GET_DATA_SUCCESS,
        payload: { categories },
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
