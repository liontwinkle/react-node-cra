import _ from 'lodash';

import types from '../actionTypes';

const INITIAL_STATE = {
  isFetchingList: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  categories: [],
  category: null,
  errors: '',
};

export default (state = INITIAL_STATE, action) => {
  const { categories } = state;

  switch (action.type) {
    case types.CATEGORIES_GET_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.CATEGORIES_GET_SUCCESS:
      return {
        ...state,
        isFetchingList: false,
        categories: action.payload.categories,
      };
    case types.CATEGORIES_GET_FAIL:
      return {
        ...state,
        isFetchingList: false,
        errors: action.payload.error,
      };

    case types.CATEGORY_CREATE_REQUEST:
      return {
        ...state,
        isCreating: true,
      };
    case types.CATEGORY_CREATE_SUCCESS:
      categories.push(action.payload.data);
      return {
        ...state,
        isCreating: false,
        categories: categories.slice(0),
        category: action.payload.data,
      };
    case types.CATEGORY_CREATE_FAIL:
      return {
        ...state,
        isCreating: false,
        errors: action.payload.error,
      };

    case types.CATEGORY_UPDATE_REQUEST:
      return {
        ...state,
        isUpdating: true,
      };
    case types.CATEGORY_UPDATE_SUCCESS:
      const categoryIdx = _.findIndex(categories, { id: action.payload.data.id });
      if (categoryIdx > -1) {
        categories.splice(categoryIdx, 1, action.payload.data);
      } else {
        categories.push(action.payload.data);
      }
      return {
        ...state,
        isUpdating: false,
        categories: categories.slice(0),
        category: action.payload.data,
      };
    case types.CATEGORY_UPDATE_FAIL:
      return {
        ...state,
        isUpdating: false,
        errors: action.payload.error,
      };

    case types.CATEGORY_DELETE_REQUEST:
      return {
        ...state,
        isDeleting: true,
      };
    case types.CATEGORY_DELETE_SUCCESS:
      const index = _.findIndex(categories, { id: action.payload.id });
      if (index > -1) {
        categories.splice(index, 1);
      }
      return {
        ...state,
        isDeleting: false,
        categories: categories.slice(0),
        category: null,
      };
    case types.CATEGORY_DELETE_FAIL:
      return {
        ...state,
        isDeleting: false,
        errors: action.payload.error,
      };

    case types.CATEGORY_SET:
      return {
        ...state,
        category: action.payload.category,
      };

    default:
      return state;
  }
};
