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
      console.log('products>>>', products);// fixme
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
export const getLength = () => (dispatch, getState) => {
  if (getState().productsData.isFetchingList) {
    return Promise.reject();
  }

  dispatch({
    type: types.PRODUCTS_GET_LENGTH_REQUEST,
  });

  const { client, type } = getState().clientsData;
  return productsService.getLength(client.id, type.key)
    .then((length) => {
      console.log('products>>>', length);// fixme
      dispatch({
        type: types.PRODUCTS_GET_LENGTH_SUCCESS,
        payload: { length },
      });
    })
    .catch((error) => {
      dispatch({
        type: types.PRODUCTS_GET_LENGTH_FAIL,
        payload: { error },
      });
      throw error;
    });
};
