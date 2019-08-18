// import _ from 'lodash';

import _ from 'lodash';
import types from '../actionTypes';
import {
  getProducts,
} from '../../utils';

const INITIAL_STATE = {
  isFetchingList: false,
  isUpdatingList: false,
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
    case types.PRODUCTS_UPDATE_REQUEST:
      return {
        ...state,
        isUpdatingList: true,
      };
    case types.PRODUCTS_UPDATE_SUCCESS:
      const orgProducts = state.originProducts;
      const newProducts = state.products;
      const updatedData = action.payload.products;
      updatedData.forEach((newItem) => {
        const orgProductsIdx = _.findIndex(orgProducts, { _id: newItem._id });
        orgProducts[orgProductsIdx] = newItem;
      });
      const newData = getProducts(action.payload.products);
      newData.data.forEach((newItem) => {
        const orgProductsIdx = _.findIndex(orgProducts, { _id: newItem._id });
        newProducts[orgProductsIdx] = newItem;
      });
      return {
        ...state,
        originProducts: orgProducts,
        products: newProducts,
        isUpdatingList: false,
      };
    case types.PRODUCTS_UPDATE_FAIL:
      return {
        ...state,
        isUpdatingList: false,
        errors: action.payload.error,
      };
    case types.PRODUCTS_SET_PRODUCTS:
      return {
        ...state,
        products: action.payload.updateData,
      };
    default:
      return state;
  }
};
