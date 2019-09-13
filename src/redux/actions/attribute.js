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

  console.log('#DEBUG CREATE ATTRIBUTE:', attribute); // fixme
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
    return;
  }

  const { client, type } = getState().clientsData;

  dispatch({
    type: types.ATTRIBUTE_UPDATE_REQUEST,
  });

  return attributesService.update(client.id, type.key, id, updatedData)
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
  if (getState().attributesData.isDeleting) {
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

// export const setCategory = category => (dispatch) => {
//   dispatch({
//     type: types.CATEGORY_SET,
//     payload: { category },
//   });
// };

export const updateNodeData = nodeData => (dispatch) => {
  dispatch({
    type: types.ATTRIBUTE_NODE_SET,
    payload: nodeData,
  });
};
