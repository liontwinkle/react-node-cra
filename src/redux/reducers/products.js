import _findIndex from 'lodash/findIndex';

import { getProducts } from 'utils';
import types from '../actionTypes';

const INITIAL_STATE = {
  isFetchingList: false,
  isUpdatingList: false,
  data: {
    products: [],
    columns: [],
    headers: [],
    valueDetails: [],
  },
  updatedData: [],
  originProducts: [],
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
      console.log('# DEBUG PRODUCTS: ', action.payload.products); // fixme
      console.log('# DEBUG PRODUCT DATA: ', data); // fixme
      return {
        ...state,
        data,
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
      const newProducts = state.data.products;
      const updatedData = action.payload.products;
      updatedData.forEach((newItem) => {
        const orgProductsIdx = _findIndex(orgProducts, { _id: newItem._id });
        orgProducts[orgProductsIdx] = newItem;
      });
      const newData = getProducts(action.payload.products);
      newData.products.forEach((newItem) => {
        const orgProductsIdx = _findIndex(orgProducts, { _id: newItem._id });
        newProducts[orgProductsIdx] = newItem;
      });

      const willSaveData = state.data;
      willSaveData.products = newProducts;
      return {
        ...state,
        originProducts: orgProducts,
        data: willSaveData,
        isUpdatingList: false,
      };
    case types.PRODUCTS_UPDATE_FAIL:
      return {
        ...state,
        isUpdatingList: false,
        errors: action.payload.error,
      };

    case types.PRODUCTS_SET_PRODUCTS:
      const currentData = state.data;
      currentData.products = action.payload.updateData;
      return {
        ...state,
        data: currentData,
      };
    case types.PRODUCTS_SET_UPDATE_PRODUCTS:
      const changedData = state.updatedData;
      const { changes } = action.payload;
      const { length } = changedData;
      const changeObj = state.data.products[changes[0][0]];
      changedData[length] = {
        ...changeObj,
        [changes[1]]: changes[3],
      };
      return {
        ...state,
        updatedData: changedData,
      };
    default:
      return state;
  }
};
