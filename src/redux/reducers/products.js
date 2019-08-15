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
  const { products } = state;

  switch (action.type) {
    case types.PRODUCTS_GET_DATA_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.PRODUCTS_GET_DATA_SUCCESS:
      console.log('recv data>>>>', action.payload.products); // fixme
      const getData = getProducts(action.payload.products);
      console.log('current state>>>>', products);// fixme
      console.log('update state>>>>', getData);// fixme
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
      console.log('recv data>>>>', action.payload.length); // fixme
      return {
        ...state,
        length: action.payload.length,
      };
    case types.PRODUCTS_GET_LENGTH_FAIL:
      return {
        ...state,
        isFetchingList: false,
        errors: action.payload.error,
      };
    default:
      return state;
  }
};
