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
//   return categoryService.update(client.id, type.key, id, updatedData)
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
//   return categoryService.remove(client.id, type.key, id)
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

// export const setCategory = category => (dispatch) => {
//   dispatch({
//     type: types.CATEGORY_SET,
//     payload: { category },
//   });
// };

// export const updateTreeData = treeData => (dispatch) => {
//   dispatch({
//     type: types.TREE_SET,
//     payload: treeData,
//   });
// };
