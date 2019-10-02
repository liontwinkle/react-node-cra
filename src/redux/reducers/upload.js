import types from '../actionTypes';

const INITIAL_STATE = {
  isUploading: false,
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
    default:
      return state;
  }
};
