import types from '../actionTypes';
import { sortByOrder } from '../../utils';

const INITIAL_STATE = {
  isFetchingList: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  propertyField: {
    id: '',
    sections: [],
    propertyFields: [],
  },
  errors: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.PROPERTY_FIELD_GET_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.PROPERTY_FIELD_GET_SUCCESS:
      let data = action.payload.propertyField[0];
      if (data !== undefined) {
        data.sections = data.sections.sort(sortByOrder);
      } else {
        data = state.propertyField;
      }
      return {
        ...state,
        isFetchingList: false,
        propertyField: data,
      };
    case types.PROPERTY_FIELD_GET_FAIL:
      return {
        ...state,
        isFetchingList: false,
        errors: action.payload.error,
      };

    case types.PROPERTY_FIELD_CREATE_REQUEST:
      return {
        ...state,
        isCreating: true,
      };
    case types.PROPERTY_FIELD_CREATE_SUCCESS:
      return {
        ...state,
        isCreating: false,
        propertyField: action.payload.data,
      };
    case types.PROPERTY_FIELD_CREATE_FAIL:
      return {
        ...state,
        isCreating: false,
        errors: action.payload.error,
      };

    case types.PROPERTY_FIELD_UPDATE_REQUEST:
      return {
        ...state,
        isUpdating: true,
      };
    case types.PROPERTY_FIELD_UPDATE_SUCCESS:
      return {
        ...state,
        isUpdating: false,
        propertyField: action.payload.data,
      };
    case types.PROPERTY_FIELD_UPDATE_FAIL:
      return {
        ...state,
        isUpdating: false,
        errors: action.payload.error,
      };

    case types.PROPERTY_FIELD_DELETE_REQUEST:
      return {
        ...state,
        isDeleting: true,
      };
    case types.PROPERTY_FIELD_DELETE_SUCCESS:
      return {
        ...state,
        isDeleting: false,
        propertyField: null,
      };
    case types.PROPERTY_FIELD_DELETE_FAIL:
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
