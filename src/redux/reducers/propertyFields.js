// import _ from 'lodash';

import types from '../actionTypes';

const INITIAL_STATE = {
  isFetchingList: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  propertyField: null,
  errors: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.PROPERTYFIELD_GET_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.PROPERTYFIELD_GET_SUCCESS:
      return {
        ...state,
        isFetchingList: false,
        propertyField: action.payload.propertyField[0],
      };
    case types.PROPERTYFIELD_GET_FAIL:
      return {
        ...state,
        isFetchingList: false,
        errors: action.payload.error,
      };

    case types.PROPERTYFIELD_CREATE_REQUEST:
      return {
        ...state,
        isCreating: true,
      };
    case types.PROPERTYFIELD_CREATE_SUCCESS:
      return {
        ...state,
        isCreating: false,
        propertyField: action.payload.data,
      };
    case types.PROPERTYFIELD_CREATE_FAIL:
      return {
        ...state,
        isCreating: false,
        errors: action.payload.error,
      };
    case types.PROPERTYFIELD_UPDATE_REQUEST:
      return {
        ...state,
        isUpdating: true,
      };
    case types.PROPERTYFIELD_UPDATE_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        propertyField: action.payload.data,
      };
    case types.PROPERTYFIELD_UPDATE_FAIL:
      return {
        ...state,
        isUpdating: false,
        errors: action.payload.error,
      };

    case types.PROPERTYFIELD_DELETE_REQUEST:
      return {
        ...state,
        isDeleting: true,
      };
    case types.PROPERTYFIELD_DELETE_SUCCESS:
      return {
        ...state,
        isDeleting: false,
        propertyField: null,
      };
    case types.PROPERTYFIELD_DELETE_FAIL:
      return {
        ...state,
        isDeleting: false,
        errors: action.payload.error,
      };
      //
      // case types.CATEGORY_SET:
      //   return {
      //     ...state,
      //     category: action.payload.category,
      //   };

    default:
      return state;
  }
// eslint-disable-next-line linebreak-style
};
