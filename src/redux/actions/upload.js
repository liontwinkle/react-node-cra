import uploadService from 'services/upload.service';
import types from '../actionTypes';

const fileUpload = data => (dispatch, getState) => {
  if (getState().uploadData.isUploading) {
    return Promise.reject();
  }

  const { client, type } = getState().clientsData;

  console.log('####### DEBUG UPLOADING #########'); // fixme
  console.log('### DEBUG DATA: ', data); // fixme
  console.log('### DEBUG CLIENT: ', client); // fixme
  console.log('### DEBUG TYPE: ', type.key); // fixme

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

export default fileUpload;
