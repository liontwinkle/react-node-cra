import attributesService from 'services/attributes.service';
import types from '../actionTypes';

const fileUpload = (clientId, type) => (dispatch, getState) => {
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

export default fileUpload;
