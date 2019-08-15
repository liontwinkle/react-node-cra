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
      console.log('recv data>>>>', action.payload.data); // fixme
      const getData = getProducts(action.payload.data);
      console.log('current state>>>>', products);// fixme
      console.log('update state>>>>', getData);// fixme
      return {
        ...state,
        isFetchingList: false,
      };
    case types.CATEGORIES_GET_FAIL:
      return {
        ...state,
        isFetchingList: false,
        errors: action.payload.error,
      };
    default:
      return state;
  }
};
