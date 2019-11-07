import historyService from 'services/history.service';
import types from '../actionTypes';

export const fetchHistories = (clientId, type) => (dispatch, getState) => {
  if (getState().historyData.isFetchingList) {
    return Promise.reject();
  }

  dispatch({
    type: types.HISTORY_FETCH_REQUEST,
  });

  return historyService.fetch(clientId, type)
    .then((data) => {
      dispatch({
        type: types.HISTORY_FETCH_SUCCESS,
        payload: { data },
      });
    })
    .catch((error) => {
      dispatch({
        type: types.HISTORY_FETCH_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const createHistory = (history) => (dispatch, getState) => {
  if (getState().historyData.isCreating) {
    return Promise.reject();
  }

  const { client } = getState().clientsData;

  dispatch({
    type: types.HISTORY_CREATE_REQUEST,
  });

  return historyService.create(client.id, history)
    .then((data) => {
      dispatch({
        type: types.HISTORY_CREATE_SUCCESS,
        payload: { data },
      });

      return data;
    })
    .catch((error) => {
      dispatch({
        type: types.HISTORY_CREATE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const removeHistory = (id) => (dispatch, getState) => {
  if (getState().historyData.isDeleting) {
    return;
  }
  const { client } = getState().clientsData;

  dispatch({
    type: types.HISTORY_REMOVE_REQUEST,
  });

  return historyService.remove(client.id, id)
    .then(() => {
      dispatch({
        type: types.HISTORY_REMOVE_SUCCESS,
        payload: { id },
      });

      return 'success';
    })
    .catch((error) => {
      dispatch({
        type: types.HISTORY_REMOVE_FAIL,
        payload: { error },
      });

      throw error;
    });
};
