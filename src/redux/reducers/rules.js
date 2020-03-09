import types from '../actionTypes';

const INITIAL_STATE = {
  isFetchingList: false,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  filteredProducts: [],
  rules: [],
  type: null,
  error: '',
  selectedRule: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.FETCH_PRODUCTS_WITH_RULES_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.FETCH_PRODUCTS_WITH_RULES_SUCCESS:
      const { data } = action.payload;
      return {
        ...state,
        isFetchingList: false,
        filteredProducts: data.allProducts,
        eachRulesCount: data.eachData,
      };
    case types.FETCH_PRODUCTS_WITH_RULES_FAIL:
      return {
        ...state,
        isFetchingList: false,
        filteredProducts: action.payload.products,
      };
    case types.FETCH_PRODUCTS_WITH_RULE_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.FETCH_PRODUCTS_WITH_RULE_SUCCESS:
      return {
        ...state,
        isFetchingList: false,
        filteredProducts: action.payload.products,
      };
    case types.FETCH_PRODUCTS_WITH_RULE_FAIL:
      return {
        ...state,
        isCreating: false,
        errors: action.payload.error,
      };
    default:
      return state;
  }
};
