import propertyFieldsService from 'services/propertyFields.service';
import types from '../actionTypes';

export const fetchPropertyFields = (clientId, type) => (dispatch, getState) => {
  if (getState().categoriesData.isFetchingList) {
    return Promise.reject();
  }

  dispatch({
    type: types.CATEGORIES_GET_REQUEST,
  });

  return propertyFieldsService.fetch(clientId, type)
    .then((categories) => {
      dispatch({
        type: types.CATEGORIES_GET_SUCCESS,
        payload: { categories },
      });
    })
    .catch((error) => {
      dispatch({
        type: types.CATEGORIES_GET_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const createPorpertyField = propertyFields => (dispatch, getState) => {
  if (getState().categoriesData.isCreating) {
    return;
  }

  const { client, type } = getState().clientsData;

  dispatch({
    type: types.PROPERTYFIELD_CREATE_REQUEST,
  });

  return propertyFieldsService.create(client.id, type.key, propertyFields)
    .then((data) => {
      console.log('recvdata>>>>', data);// fixme
      dispatch({
        type: types.PROPERTYFIELD_CREATE_SUCCESS,
        payload: { data },
      });

      return data;
    })
    .catch((error) => {
      console.log('recverror>>>>', error);// fixme
      dispatch({
        type: types.PROPERTYFIELD_CREATE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

// export const updateCategory = (id, updatedData) => (dispatch, getState) => {
//   if (getState().categoriesData.isUpdating) {
//     return;
//   }
//
//   const { client, type } = getState().clientsData;
//
//   dispatch({
//     type: types.CATEGORY_UPDATE_REQUEST,
//   });
//
//   return propertyFieldsService.update(client.id, type.key, id, updatedData)
//     .then((data) => {
//       dispatch({
//         type: types.CATEGORY_UPDATE_SUCCESS,
//         payload: { data },
//       });
//
//       return 'success';
//     })
//     .catch((error) => {
//       dispatch({
//         type: types.CATEGORY_UPDATE_FAIL,
//         payload: { error },
//       });
//
//       throw error;
//     });
// };
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
