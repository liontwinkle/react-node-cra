import clientService from 'services/client.service';
import types from '../actionTypes';

export const fetchClients = () => (dispatch, getState) => {
  if (getState().clientsData.isFetchingList) {
    return Promise.reject();
  }

  dispatch({
    type: types.CLIENTS_GET_REQUEST,
  });

  return clientService.fetch()
    .then((clients) => {
      dispatch({
        type: types.CLIENTS_GET_SUCCESS,
        payload: { clients },
      });
    })
    .catch((error) => {
      dispatch({
        type: types.CLIENTS_GET_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const createClient = client => (dispatch, getState) => {
  if (getState().clientsData.isCreating) {
    return;
  }

  dispatch({
    type: types.CLIENT_CREATE_REQUEST,
  });

  return clientService.create(client)
    .then((data) => {
      dispatch({
        type: types.CLIENT_CREATE_SUCCESS,
        payload: { data },
      });

      return 'success';
    })
    .catch((error) => {
      dispatch({
        type: types.CLIENT_CREATE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const updateClient = updatedData => (dispatch, getState) => {
  if (getState().clientsData.isUpdating) {
    return;
  }

  dispatch({
    type: types.CLIENT_UPDATE_REQUEST,
  });

  const { id } = getState().clientsData.client;
  return clientService.update(id, updatedData)
    .then((data) => {
      dispatch({
        type: types.CLIENT_UPDATE_SUCCESS,
        payload: { data },
      });

      return 'success';
    })
    .catch((error) => {
      dispatch({
        type: types.CLIENT_UPDATE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const removeClient = () => (dispatch, getState) => {
  if (getState().clientsData.isDeleting) {
    return;
  }

  dispatch({
    type: types.CLIENT_DELETE_REQUEST,
  });

  const { id } = getState().clientsData.client;

  return clientService.remove(id)
    .then(() => {
      dispatch({
        type: types.CLIENT_DELETE_SUCCESS,
        payload: { id },
      });

      return 'success';
    })
    .catch((error) => {
      dispatch({
        type: types.CLIENT_DELETE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const setClient = client => (dispatch) => {
  dispatch({
    type: types.CLIENT_SET,
    payload: { client },
  });
};

export const setClientType = type => (dispatch) => {
  dispatch({
    type: types.CLIENT_SET_TYPE,
    payload: { type },
  });
};
export const setProductViewType = productViewType => (dispatch) => {
  dispatch({
    type: types.CLIENT_SET_PRODUCT_VIEW_TYPE,
    payload: { productViewType },
  });
};
