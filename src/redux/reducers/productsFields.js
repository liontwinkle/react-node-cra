import types from '../actionTypes';

const INITIAL_STATE = {
  isFetchingList: false,
  isUpdating: false,
  isDeleting: false,
  isChange: false, // fixme
  productsField: {},
  errors: '',
  imageKey: 'image',
  hoverSize: {
    width: 730,
    height: 530,
  },
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.PRODUCTS_GET_FIELDS_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.PRODUCTS_GET_FIELDS_SUCCESS:
      const data = (action.payload.productsField.length > 0 && action.payload.productsField[0].fields)
        ? action.payload.productsField[0].fields : {};
      const imageKey = (action.payload.productsField.length > 0 && action.payload.productsField[0].imageKey)
        ? action.payload.productsField[0].imageKey : 'image';
      return {
        ...state,
        isFetchingList: false,
        productsField: data,
        imageKey,
      };
    case types.PRODUCTS_GET_FIELDS_FAIL:
      return {
        ...state,
        isFetchingList: false,
        errors: action.payload.error,
      };

    case types.PRODUCTS_UPDATE_FIELDS_REQUEST:
      return Object.assign({}, state, {
        isUpdating: true,
      });
    case types.PRODUCTS_UPDATE_FIELDS_SUCCESS:
      return Object.assign({}, state, {
        isUpdating: false,
        productsField: JSON.parse(action.payload.data).fields,
      });
    case types.PRODUCTS_UPDATE_FIELDS_FAIL:
      return {
        ...state,
        isUpdating: false,
        errors: action.payload.error,
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
    case types.PRODUCTS_SET_IMAGEKEY_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        imageKey: action.payload.data.imageKey,
      };
    case types.PRODUCTS_SET_IMAGEKEY_REQEUST:
      return {
        ...state,
        isUpdating: true,
      };
    case types.PRODUCTS_SET_IMAGEKEY_ERROR:
      return {
        ...state,
        isUpdating: false,
        errors: action.payload.error,
      };
    case types.PRODUCTS_HOVER_SIZE:
      return {
        ...state,
        hoverSize: action.payload.size,
      };
    case types.TEST_ACTION: // fixme
      return {
        ...state,
        isUpdating: true,
      };
    default:
      return state;
  }
};
