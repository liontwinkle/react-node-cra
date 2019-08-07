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
  const { propertyFields } = state;

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
      propertyFields.push(action.payload.data);
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
      //
      // case types.CATEGORY_DELETE_REQUEST:
      //   return {
      //     ...state,
      //     isDeleting: true,
      //   };
      // case types.CATEGORY_DELETE_SUCCESS:
      //   const index = _.findIndex(categories, { id: action.payload.id });
      //   if (index > -1) {
      //     categories.splice(index, 1);
      //   }
      //   return {
      //     ...state,
      //     isDeleting: false,
      //     categories: categories.slice(0),
      //     category: null,
      //   };
      // case types.CATEGORY_DELETE_FAIL:
      //   return {
      //     ...state,
      //     isDeleting: false,
      //     errors: action.payload.error,
      //   };
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
