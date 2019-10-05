import types from '../actionTypes';

const INITIAL_STATE = {
  isUploading: false,
  isKeyUploading: false,
  errors: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.UPLOAD_DATA_REQUEST:
      return {
        ...state,
        isUploading: true,
        errors: '',
      };
    case types.UPLOAD_DATA_SUCCESS:
      console.log(action.payload);
      return {
        ...state,
        isUploading: false,
        errors: '',
      };
    case types.UPLOAD_DATA_FAIL:
      return {
        ...state,
        isUploading: false,
        errors: action.payload.errors,
      };
    case types.UPLOAD_KEY_DATA_REQUEST:
      return {
        ...state,
        isKeyUploading: true,
        errors: '',
      };
    case types.UPLOAD_KEY_DATA_SUCCESS:
      return {
        ...state,
        isKeyUploading: false,
        errors: '',
      };
    case types.UPLOAD_KEY_DATA_FAIL:
      return {
        ...state,
        isKeyUploading: false,
        errors: action.payload.errors,
      };
    default:
      return state;
  }
};
