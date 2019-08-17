// import _ from 'lodash';

import types from '../actionTypes';
import {
  getProducts,
} from '../../utils';

const INITIAL_STATE = {
  isFetchingList: false,
  products: [],
  originProducts: [],
  columns: [],
  headers: [],
  numbers: [],
  errors: '',
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.PRODUCTS_GET_DATA_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.PRODUCTS_GET_DATA_SUCCESS:
      const data = getProducts(action.payload.products);
      return {
        ...state,
        columns: data.columns,
        headers: data.headers,
        numbers: data.numbers,
        products: data.data,
        originProducts: action.payload.products,
        isFetchingList: false,
      };
    case types.PRODUCTS_GET_DATA_FAIL:
      return {
        ...state,
        isFetchingList: false,
        errors: action.payload.error,
      };
    default:
      return state;
  }
};
