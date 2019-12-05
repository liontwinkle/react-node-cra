import types from '../actionTypes';

export const setPreviewCategory = (data) => (dispatch) => {
  dispatch({
    type: types.SET_PREVIEW_CATEGORY,
    payload: data,
  });
};

export const setRootCategory = (data) => (dispatch) => {
  dispatch({
    type: types.SET_ROOT_CATEGORY,
    payload: data,
  });
};
