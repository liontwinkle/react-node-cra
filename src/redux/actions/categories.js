import categoryService from 'services/category.service';
import types from '../actionTypes';

export const fetchCategories = (clientId, type) => (dispatch, getState) => {
  if (getState().categoriesData.isFetchingList) {
    return Promise.reject();
  }

  dispatch({
    type: types.CATEGORIES_GET_REQUEST,
  });

  return categoryService.fetch(clientId, type)
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

export const createCategory = category => (dispatch, getState) => {
  if (getState().categoriesData.isCreating) {
    return;
  }

  const { client, type } = getState().clientsData;

  dispatch({
    type: types.CATEGORY_CREATE_REQUEST,
  });

  return categoryService.create(client.id, type.key, category)
    .then((data) => {
      dispatch({
        type: types.CATEGORY_CREATE_SUCCESS,
        payload: { data },
      });

      return data;
    })
    .catch((error) => {
      dispatch({
        type: types.CATEGORY_CREATE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const updateCategory = (id, updatedData) => (dispatch, getState) => {
  if (getState().categoriesData.isUpdating) {
    return;
  }

  const { client, type } = getState().clientsData;

  dispatch({
    type: types.CATEGORY_UPDATE_REQUEST,
  });

  return categoryService.update(client.id, type.key, id, updatedData)
    .then((data) => {
      dispatch({
        type: types.CATEGORY_UPDATE_SUCCESS,
        payload: { data },
      });

      return 'success';
    })
    .catch((error) => {
      dispatch({
        type: types.CATEGORY_UPDATE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const removeCategory = id => (dispatch, getState) => {
  if (getState().categoriesData.isDeleting) {
    return;
  }

  const { client, type } = getState().clientsData;

  dispatch({
    type: types.CATEGORY_DELETE_REQUEST,
  });

  return categoryService.remove(client.id, type.key, id)
    .then(() => {
      dispatch({
        type: types.CATEGORY_DELETE_SUCCESS,
        payload: { id },
      });

      return 'success';
    })
    .catch((error) => {
      dispatch({
        type: types.CATEGORY_DELETE_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const setCategory = category => (dispatch) => {
  dispatch({
    type: types.CATEGORY_SET,
    payload: { category },
  });
};

export const updateTreeData = treeData => (dispatch) => {
  dispatch({
    type: types.TREE_SET,
    payload: treeData,
  });
};
