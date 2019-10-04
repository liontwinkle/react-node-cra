import uploadService from 'services/upload.service';
import types from '../actionTypes';

export const fileUpload = data => (dispatch, getState) => {
  if (getState().uploadData.isUploading) {
    return Promise.reject();
  }

  const { client, type } = getState().clientsData;

  dispatch({
    type: types.UPLOAD_DATA_REQUEST,
  });

  return uploadService.upload(client.code, type.key, data)
    .then((data) => {
      dispatch({
        type: types.UPLOAD_DATA_SUCCESS,
        payload: { data },
      });
    })
    .catch((error) => {
      dispatch({
        type: types.UPLOAD_DATA_FAIL,
        payload: { error },
      });

      throw error;
    });
};

export const keyUpload = data => (dispatch, getState) => {
  if (getState().uploadData.isUploading) {
    return Promise.reject();
  }

  const { client, type } = getState().clientsData;

  dispatch({
    type: types.UPLOAD_DATA_REQUEST,
  });

  return uploadService.keyUpload(client.id, type.key, data)
    .then((data) => {
      dispatch({
        type: types.UPLOAD_DATA_SUCCESS,
        payload: { data },
      });
    })
    .catch((error) => {
      dispatch({
        type: types.UPLOAD_DATA_FAIL,
        payload: { error },
      });

      throw error;
    });
};
