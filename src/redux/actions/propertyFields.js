import propertyFieldsService from 'services/propertyFields.service';
import types from '../actionTypes';

export const fetchPropertyField = (clientId, type) => (dispatch, getState) => {
  if (getState().propertyFieldsData.isFetchingList) {
    return Promise.reject();
  }

  dispatch({
    type: types.PROPERTY_FIELD_GET_REQUEST,
  });

  return propertyFieldsService.fetch(clientId, type)
    .then((propertyField) => {
      dispatch({
        type: types.PROPERTY_FIELD_GET_SUCCESS,
        payload: { propertyField },
      });
    })
    .catch((error) => {
      dispatch({
        type: types.PROPERTY_FIELD_GET_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const createPropertyField = clientData => (dispatch, getState) => {
  if (getState().propertyFieldsData.isCreating) {
    return;
  }

  const { clients } = getState().clientsData;
  const client = clients.filter(item => (item.name === clientData.name));
  const type = ['virtual', 'native', 'products', 'attributes'];
  const propertyFields = [];
  type.forEach((item) => {
    propertyFields.push({
      clientId: client[0].id,
      type: item,
    });
  });

  dispatch({
    type: types.PROPERTY_FIELD_CREATE_REQUEST,
  });

  return propertyFieldsService.create(propertyFields)
    .then((data) => {
      dispatch({
        type: types.PROPERTY_FIELD_CREATE_SUCCESS,
        payload: { data },
      });
      return data;
    })
    .catch((error) => {
      dispatch({
        type: types.PROPERTY_FIELD_CREATE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const updatePropertyField = updatedData => (dispatch, getState) => {
  if (getState().propertyFieldsData.isUpdating) {
    return;
  }

  const { client, type } = getState().clientsData;
  console.log('#### DEBUG :', getState().propertyFieldsData.propertyField); // fixme
  const { id } = getState().propertyFieldsData.propertyField;
  dispatch({
    type: types.PROPERTY_FIELD_UPDATE_REQUEST,
  });

  return propertyFieldsService.update(client.id, type.key, id, updatedData)
    .then((data) => {
      dispatch({
        type: types.PROPERTY_FIELD_UPDATE_SUCCESS,
        payload: { data },
      });

      return 'success';
    })
    .catch((error) => {
      dispatch({
        type: types.PROPERTY_FIELD_UPDATE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const removePropertyField = () => (dispatch, getState) => {
  if (getState().propertyFieldsData.isDeleting) {
    return;
  }

  const { client } = getState().clientsData;

  dispatch({
    type: types.PROPERTY_FIELD_DELETE_REQUEST,
  });

  return propertyFieldsService.remove(client.id)
    .then(() => {
      dispatch({
        type: types.PROPERTY_FIELD_DELETE_SUCCESS,
      });

      return 'success';
    })
    .catch((error) => {
      dispatch({
        type: types.PROPERTY_FIELD_DELETE_FAIL,
        payload: { error },
      });

      throw error;
    });
};
//
// export const setCategory = category => (dispatch) => {
//   dispatch({
//     type: types.CATEGORY_SET,
//     payload: { category },
//   });
// };
