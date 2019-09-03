import _merge from 'lodash/merge';
import _findIndex from 'lodash/findIndex';

import { getCategoryTree } from 'utils';
import types from '../actionTypes';

const INITIAL_STATE = {
  isFetchingList: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  categories: [],
  trees: [],
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
      const tempDatas = action.payload.categories;
      if (Array.isArray(tempDatas)) {
        tempDatas.forEach((item, itemKey) => {
          const { properties } = item;
          if (properties) {
            const keys = Object.keys(properties);
            keys.forEach((key) => {
              if (Array.isArray(properties[key])) {
                tempDatas[itemKey].properties[key] = JSON.stringify(tempDatas[itemKey].properties[key]);
              }
            });
          }
        });
      }
      return {
        ...state,
        isFetchingList: false,
        categories: tempDatas,
        trees: getCategoryTree(action.payload.categories),
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
      const { data } = action.payload;
      if (data.properties) {
        const keys = Object.keys(data.properties);
        keys.forEach((key) => {
          if (Array.isArray(data.properties[key])) {
            data.properties[key] = JSON.stringify(data.properties[key]);
          }
        });
      }
      categories.push(data);
      const treeData = _merge(getCategoryTree(categories), state.trees);
      return {
        ...state,
        isCreating: false,
        categories: categories.slice(0),
        trees: treeData,
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
      const updateData = action.payload.data;
      const { properties } = updateData;
      if (properties) {
        const keys = Object.keys(properties);
        keys.forEach((key) => {
          if (Array.isArray(properties[key])) {
            updateData.properties[key] = JSON.stringify(updateData.properties[key]);
          }
        });
      }
      const categoryIdx = _findIndex(categories, { id: updateData.id });
      if (categoryIdx > -1) {
        categories.splice(categoryIdx, 1, updateData);
      } else {
        categories.push(updateData);
      }
      const newTrees = _merge(state.trees, getCategoryTree(categories));
      return {
        ...state,
        isUpdating: false,
        categories: categories.slice(0),
        trees: newTrees,
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
      const index = _findIndex(categories, { id: action.payload.id });
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

    case types.TREE_SET:
      return {
        ...state,
        trees: action.payload,
      };

    default:
      return state;
  }
};
