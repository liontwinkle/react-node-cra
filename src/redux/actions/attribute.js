import attributesService from 'services/attributes.service';
import types from '../actionTypes';

export const fetchAttributes = (clientId, type) => (dispatch, getState) => {
  if (getState().attributesData.isFetchingList) {
    return Promise.reject();
  }

  dispatch({
    type: types.ATTRIBUTE_FETCH_REQUEST,
  });

  return attributesService.fetch(clientId, type)
    .then((attributes) => {
      dispatch({
        type: types.ATTRIBUTE_FETCH_SUCCESS,
        payload: { attributes },
      });
    })
    .catch((error) => {
      dispatch({
        type: types.ATTRIBUTE_FETCH_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const createAttribute = attribute => (dispatch, getState) => {
  if (getState().attributesData.isCreating) {
    return;
  }

  const { client, type } = getState().clientsData;

  dispatch({
    type: types.ATTRIBUTE_CREATE_REQUEST,
  });

  return attributesService.create(client.id, type.key, attribute)
    .then((data) => {
      dispatch({
        type: types.ATTRIBUTE_CREATE_SUCCESS,
        payload: { data },
      });

      return data;
    })
    .catch((error) => {
      dispatch({
        type: types.ATTRIBUTE_CREATE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const updateAttribute = (id, updatedData) => (dispatch, getState) => {
  if (getState().attributesData.isUpdating) {
    return Promise.reject();
  }

  const { client } = getState().clientsData;

  dispatch({
    type: types.ATTRIBUTE_UPDATE_REQUEST,
  });

  return attributesService.update(client.id, 'attributes', id, updatedData)
    .then((data) => {
      dispatch({
        type: types.ATTRIBUTE_UPDATE_SUCCESS,
        payload: { data },
      });

      return 'success';
    })
    .catch((error) => {
      dispatch({
        type: types.ATTRIBUTE_UPDATE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const removeAttribute = id => (dispatch, getState) => {
  if (getState().attributesData.isUpdating) {
    return;
  }

  const { client, type } = getState().clientsData;

  dispatch({
    type: types.ATTRIBUTE_REMOVE_REQUEST,
  });

  return attributesService.remove(client.id, type.key, id)
    .then(() => {
      dispatch({
        type: types.ATTRIBUTE_REMOVE_SUCCESS,
        payload: { id },
      });
      return 'success';
    })
    .catch((error) => {
      dispatch({
        type: types.ATTRIBUTE_REMOVE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const setAttribute = attribute => (dispatch) => {
  dispatch({
    type: types.ATTRIBUTE_SET,
    payload: { attribute },
  });
};

export const updateNodeData = nodeData => (dispatch) => {
  dispatch({
    type: types.ATTRIBUTE_NODE_SET,
    payload: nodeData,
  });
};

export const updateDefaultOnAttriute = updateData => (dispatch, getState) => {
  if (getState().attributesData.isUpdating) {
    return;
  }

  const { client, type } = getState().clientsData;

  dispatch({
    type: types.ATTRIBUTE_UPDATE_DEFAULT_REQUEST,
  });

  return attributesService.updateDefaultData(client.id, type.key, updateData)
    .then((data) => {
      dispatch({
        type: types.ATTRIBUTE_UPDATE_DEFAULT_SUCCESS,
        payload: { data },
      });
      return data;
    })
    .catch((error) => {
      dispatch({
        type: types.ATTRIBUTE_UPDATE_DEFAULT_FAIL,
        payload: { error },
      });
      throw error;
    });
};
