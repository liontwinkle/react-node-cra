import types from '../actionTypes';

const INITIAL_STATE = {
  selectedCategory: {},
  rootCategories: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_PREVIEW_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload,
      };
    case types.SET_ROOT_CATEGORY:
      return {
        ...state,
        rootCategories: action.payload,
      };
    default:
      return state;
  }
};
