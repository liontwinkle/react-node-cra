import _findIndex from 'lodash/findIndex';

import {
  getCategoryTree, changePropertiesData, convertPropertyData, checkObject, sortByField,
} from 'utils';
import types from '../actionTypes';

const INITIAL_STATE = {
  isFetchingList: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  categories: [],
  preProducts: null,
  trees: [],
  associations: [],
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
      const tempDatas = changePropertiesData(action.payload.categories);
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
      tempDatas.sort(sortByField('name'));
      const fetchSaveData = getCategoryTree(tempDatas, state.trees || []);
      return {
        ...state,
        isFetchingList: false,
        categories: JSON.parse(JSON.stringify(tempDatas)),
        category: tempDatas.filter((item) => (item.parent_id === null))[0] || null,
        trees: fetchSaveData.subTree,
        associations: fetchSaveData.association,
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
      const data = convertPropertyData(action.payload.data);
      if (data.properties) {
        const keys = Object.keys(data.properties);
        keys.forEach((key) => {
          if (Array.isArray(data.properties[key])) {
            data.properties[key] = JSON.stringify(data.properties[key]);
          }
        });
      }
      const createdCategories = [data, ...categories];

      const updateSaveData = getCategoryTree(createdCategories, state.trees, data.parent_id);

      return {
        ...state,
        isCreating: false,
        categories: JSON.parse(JSON.stringify(createdCategories.slice(0))),
        trees: JSON.parse(JSON.stringify(updateSaveData.subTree)),
        associations: JSON.parse(JSON.stringify(updateSaveData.association)),
        category: JSON.parse(JSON.stringify(data)),
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
      const updateData = convertPropertyData(action.payload.data);
      const { properties } = updateData;
      if (properties) {
        const keys = Object.keys(properties);
        keys.forEach((key) => {
          if (Array.isArray(properties[key])) {
            updateData.properties[key] = JSON.stringify(updateData.properties[key]);
          } else if (checkObject(properties[key])) {
            updateData.properties[key] = JSON.parse(JSON.stringify(updateData.properties[key]));
          }
        });
      }

      const categoryIdx = _findIndex(categories, { _id: updateData._id });
      if (categoryIdx > -1) {
        categories.splice(categoryIdx, 1, updateData);
      } else {
        categories.push(updateData);
      }

      const newSaveData = getCategoryTree(categories, state.trees);
      return {
        ...state,
        isUpdating: false,
        categories: JSON.parse(JSON.stringify(categories.slice(0))),
        trees: newSaveData.subTree,
        associations: newSaveData.association,
        category: updateData,
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
      const index = _findIndex(categories, { _id: action.payload.id });
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

    case types.MATCHED_PRODUCT:
      return {
        ...state,
        preProducts: action.payload,
      };
    case types.CATEGORY_UPDATE_DEFAULT_REQUEST:
      return {
        ...state,
        isUpdating: true,
      };
    case types.CATEGORY_UPDATE_DEFAULT_SUCCESS:
      return {
        ...state,
        isUpdating: false,
      };
    case types.CATEGORY_UPDATE_DEFAULT_FAIL:
      return {
        ...state,
        isUpdating: false,
        errors: action.payload.error,
      };
    default:
      return state;
  }
};
