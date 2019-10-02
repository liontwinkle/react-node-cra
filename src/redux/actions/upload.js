// import uploadService from 'services/upload.service';
// import types from '../actionTypes';

const validateVirtualData = (data) => {
  console.log('### DEBUG VALIDATE VIRTUAL DATA', data);
};

const validateAttributeData = (data) => {
  console.log('### DEBUG VALIDATE VIRTUAL DATA', data);
};

const validateNativeData = (data) => {
  console.log('### DEBUG VALIDATE VIRTUAL DATA', data);
};

const validateProductsData = (data) => {
  console.log('### DEBUG VALIDATE VIRTUAL DATA', data);
};

const validateData = (type, data) => {
  console.log('### DEBUG TYPE: ', type);
  switch (type) {
    case 'virtual':
      return validateVirtualData(data);
    case 'attributes':
      return validateAttributeData(data);
    case 'products':
      return validateProductsData(data);
    case 'native':
      return validateNativeData(data);
    default:
      return false;
  }
};
const fileUpload = data => (dispatch, getState) => {
  if (getState().uploadData.isUploading) {
    return Promise.reject();
  }

  const { client, type } = getState().clientsData;

  console.log('####### DEBUG UPLOADING #########'); // fixme
  console.log('### DEBUG DATA: ', data); // fixme
  console.log('### DEBUG CLIENT: ', client.id); // fixme
  console.log('### DEBUG TYPE: ', type.key); // fixme

  if (validateData(type.key, data)) {
    console.log('##### DEBUG PASSED VALIDATE #####'); // fixme
  } else {
    console.log('##### DEBUG NOT PASSED VALIDATE #####'); // fixme
  }

  // dispatch({
  //   type: types.UPLOAD_DATA_REQUEST,
  // });

  // return uploadService.upload(client.id, type.key, data)
  //   .then((data) => {
  //     dispatch({
  //       type: types.UPLOAD_DATA_SUCCESS,
  //       payload: { data },
  //     });
  //   })
  //   .catch((error) => {
  //     dispatch({
  //       type: types.UPLOAD_DATA_FAIL,
  //       payload: { error },
  //     });
  //
  //     throw error;
  //   });
};

export default fileUpload;
