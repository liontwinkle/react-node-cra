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
  const time3 = performance.now();
  if (getState().productsFieldsData.isUpdating) {
    return;
  }

  const { client } = getState().clientsData;

  dispatch({
    type: types.PRODUCTS_UPDATE_FIELDS_REQUEST,
  });

  const data = {
    imageKey: getState().productsFieldsData.imageKey,
    fields: updatedData,
  };
  console.log('# DEBUG RUNNING TIME OF ACTION BEFORE API: ', performance.now() - time3); // fixme
  return productsFieldsService.update(client.id, data)
    .then(() => {
      console.log('# DEBUG RUNNING TIME OF ACTION AFTER API: ', performance.now() - time3); // fixme
      dispatch({
        type: types.PRODUCTS_UPDATE_FIELDS_SUCCESS,
        payload: { data: JSON.stringify(data) },
      });
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

export const setImageKey = imageKey => (dispatch, getState) => {
  if (getState().productsFieldsData.isUpdating) {
    return Promise.reject();
  }

  dispatch({
    type: types.PRODUCTS_SET_IMAGEKEY_REQEUST,
  });

  const { client } = getState().clientsData;

  const data = {
    imageKey,
    fields: getState().productsFieldsData.productsField,
  };
  return productsFieldsService.updateImageKey(client.id, data)
    .then((data) => {
      dispatch({
        type: types.PRODUCTS_SET_IMAGEKEY_SUCCESS,
        payload: { data },
      });
    })
    .catch((error) => {
      dispatch({
        type: types.PRODUCTS_SET_IMAGEKEY_ERROR,
        payload: { imageKey },
      });
      throw error;
    });
};
