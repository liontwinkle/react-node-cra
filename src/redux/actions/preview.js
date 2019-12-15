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

export const setPathUrl = (urlData) => (dispatch) => {
  dispatch({
    type: types.SET_URL_PATH_NAV,
    payload: urlData,
  });
};

export const movePointedPath = (id) => (dispatch) => {
  dispatch({
    type: types.MOVE_POINTED_PATH,
    payload: id,
  });
};
