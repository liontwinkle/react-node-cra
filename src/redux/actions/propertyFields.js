import propertyFieldsService from 'services/propertyFields.service';
import types from '../actionTypes';

export const fetchPropertyField = (clientId, type) => (dispatch, getState) => {
  if (getState().propertyFieldsData.isFetchingList) {
    return Promise.reject();
  }

  dispatch({
    type: types.PROPERTYFIELD_GET_REQUEST,
  });

  return propertyFieldsService.fetch(clientId, type)
    .then((propertyField) => {
      dispatch({
        type: types.PROPERTYFIELD_GET_SUCCESS,
        payload: { propertyField },
      });
    })
    .catch((error) => {
      dispatch({
        type: types.PROPERTYFIELD_GET_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const createPorpertyField = (clientData, type) => (dispatch, getState) => {
  if (getState().propertyFieldsData.isCreating) {
    return;
  }

  const { clients } = getState().clientsData;
  const client = clients.filter(item => (item.name === clientData.name));
  const propertyFields = {
    clientId: client[0].id,
    type,
  };
  dispatch({
    type: types.PROPERTYFIELD_CREATE_REQUEST,
  });
  return propertyFieldsService.create(propertyFields)
    .then((data) => {
      dispatch({
        type: types.PROPERTYFIELD_CREATE_SUCCESS,
        payload: { data },
      });
      return data;
    })
    .catch((error) => {
      dispatch({
        type: types.PROPERTYFIELD_CREATE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const updatePorpertyField = (id, updatedData) => (dispatch, getState) => {
  if (getState().propertyFieldsData.isUpdating) {
    return;
  }

  const { client, type } = getState().clientsData;

  dispatch({
    type: types.PROPERTYFIELD_UPDATE_REQUEST,
  });
  console.log('updateData>>>', updatedData);// fixme

  return propertyFieldsService.update(client.id, type.key, id, updatedData)
    .then((data) => {
      dispatch({
        type: types.PROPERTYFIELD_UPDATE_SUCCESS,
        payload: { data },
      });

      return 'success';
    })
    .catch((error) => {
      dispatch({
        type: types.PROPERTYFIELD_UPDATE_FAIL,
        payload: { error },
      });

      throw error;
    });
};
//
// export const removeCategory = id => (dispatch, getState) => {
//   if (getState().categoriesData.isDeleting) {
//     return;
//   }
//
//   const { client, type } = getState().clientsData;
//
//   dispatch({
//     type: types.CATEGORY_DELETE_REQUEST,
//   });
//
//   return propertyFieldsService.remove(client.id, type.key, id)
//     .then(() => {
//       dispatch({
//         type: types.CATEGORY_DELETE_SUCCESS,
//         payload: { id },
//       });
//
//       return 'success';
//     })
//     .catch((error) => {
//       dispatch({
//         type: types.CATEGORY_DELETE_FAIL,
//         payload: { error },
//       });
//
//       throw error;
//     });
// };
//
// export const setCategory = category => (dispatch) => {
//   dispatch({
//     type: types.CATEGORY_SET,
//     payload: { category },
//   });
// };
