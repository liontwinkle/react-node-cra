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
    default:
      return state;
  }
};
