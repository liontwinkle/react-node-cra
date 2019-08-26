// import _ from 'lodash';
import types from '../actionTypes';

const INITIAL_STATE = {
  isFetchingList: false,
  isUpdating: false,
  isDeleting: false,

  productsField: {},
  errors: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.PRODUCTS_GET_FIELDS_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.PRODUCTS_GET_FIELDS_SUCCESS:
      const data = (action.payload.productsField.length > 0)
        ? action.payload.productsField[0].fields : {};
      console.log('data>>>>', data);// fixme
      return {
        ...state,
        isFetchingList: false,
        productsField: data,
      };
    case types.PRODUCTS_GET_FIELDS_FAIL:
      return {
        ...state,
        isFetchingList: false,
        errors: action.payload.error,
      };
    case types.PRODUCTS_UPDATE_FIELDS_REQUEST:
      return {
        ...state,
        isUpdating: true,
      };
    case types.PRODUCTS_UPDATE_FIELDS_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        productsField: action.payload.data.fields,
      };
    case types.PRODUCTS_UPDATE_FIELDS_FAIL:
      return {
        ...state,
        isUpdating: false,
        errors: action.payload.error,
      };

    case types.PRODUCTS_DELETE_FIELDS_REQUEST:
      return {
        ...state,
        isDeleting: true,
      };
    case types.PRODUCTS_DELETE_FIELDS_SUCCESS:
      return {
        ...state,
        isDeleting: false,
        productsField: {},
      };
    case types.PRODUCTS_DELETE_FIELDS_FAIL:
      return {
        ...state,
        isDeleting: false,
        errors: action.payload.error,
      };
    default:
      return state;
  }
// eslint-disable-next-line linebreak-style
};
