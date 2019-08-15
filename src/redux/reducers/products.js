// import _ from 'lodash';

import types from '../actionTypes';
import {
  getProducts,
} from '../../utils';

const INITIAL_STATE = {
  isFetchingList: false,
  products: [],
  columns: [],
  headers: [],
  index: 0,
  length: 0,
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
      const getData = getProducts(action.payload.products);
      return {
        ...state,
        columns: getData.columns,
        headers: getData.headers,
        products: getData.data,
        isFetchingList: false,
      };
    case types.PRODUCTS_GET_DATA_FAIL:
      return {
        ...state,
        isFetchingList: false,
        errors: action.payload.error,
      };
    case types.PRODUCTS_GET_LENGTH_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.PRODUCTS_GET_LENGTH_SUCCESS:
      return {
        ...state,
        length: action.payload.length,
        isFetchingList: false,
      };
    case types.PRODUCTS_GET_LENGTH_FAIL:
      return {
        ...state,
        isFetchingList: false,
        errors: action.payload.error,
      };
    case types.PRODUCTS_SET_INDEX:
      return {
        ...state,
        index: action.payload.index,
      };
    default:
      return state;
  }
};
