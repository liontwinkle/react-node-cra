import _merge from 'lodash/merge';
import { getAttribute } from 'utils';
import types from '../actionTypes';

const INITIAL_STATE = {
  isFetchingList: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  attributes: [],
  nodes: [],
  attribute: null,
  errors: '',
};

export default (state = INITIAL_STATE, action) => {
  const { attributes } = state;

  switch (action.type) {
    case types.ATTRIBUTE_FETCH_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.ATTRIBUTE_FETCH_SUCCESS:
      return {
        ...state,
        isFetchingList: false,
        attributes: action.payload.attributes,
        attribute: null,
        nodes: getAttribute(action.payload.attributes),
      };
    case types.ATTRIBUTE_FETCH_FAIL:
      return {
        ...state,
        isFetchingList: false,
        errors: action.payload.error,
      };

    case types.ATTRIBUTE_CREATE_REQUEST:
      return {
        ...state,
        isCreating: true,
      };
    case types.ATTRIBUTE_CREATE_SUCCESS:
      const { data } = action.payload;
      console.log('################  DEBUG ATTRIBUTE CREATE ACTION #######################'); // fixme
      console.log('#DEBUG RECV DATA:', data); // fixme
      attributes.push(data);
      console.log('#DEBUG ATTRIBUTE DATA:', attributes); // fixme

      const nodeData = _merge(getAttribute(attributes), state.nodes);
      console.log('#DEBUG NODE DATA DATA:', nodeData); // fixme
      return {
        ...state,
        isCreating: false,
        attributes: attributes.slice(0),
        nodes: nodeData,
        attribute: action.payload.data,
      };
      // if (data.properties) {
      //   const keys = Object.keys(data.properties);
      //   keys.forEach((key) => {
      //     if (Array.isArray(data.properties[key])) {
      //       data.properties[key] = JSON.stringify(data.properties[key]);
      //     }
      //   });
      // }
      // categories.push(data);
      // const treeData = _merge(getCategoryTree(categories), state.trees);
      // return {
      //   ...state,
      //   isCreating: false,
      //   categories: categories.slice(0),
      //   trees: treeData,
      //   category: action.payload.data,
      // };
    case types.CATEGORY_CREATE_FAIL:
      return {
        ...state,
        isCreating: false,
        errors: action.payload.error,
      };

      // case types.CATEGORY_UPDATE_REQUEST:
      //   return {
      //     ...state,
      //     isUpdating: true,
      //   };
      // case types.CATEGORY_UPDATE_SUCCESS:
      //   const updateData = action.payload.data;
      //   const { properties } = updateData;
      //   if (properties) {
      //     const keys = Object.keys(properties);
      //     keys.forEach((key) => {
      //       if (Array.isArray(properties[key])) {
      //         updateData.properties[key] = JSON.stringify(updateData.properties[key]);
      //       }
      //     });
      //   }
      //   const categoryIdx = _findIndex(categories, { id: updateData.id });
      //   if (categoryIdx > -1) {
      //     categories.splice(categoryIdx, 1, updateData);
      //   } else {
      //     categories.push(updateData);
      //   }
      //   const newTrees = _merge(state.trees, getCategoryTree(categories));
      //   return {
      //     ...state,
      //     isUpdating: false,
      //     categories: categories.slice(0),
      //     trees: newTrees,
      //     category: action.payload.data,
      //   };
      // case types.CATEGORY_UPDATE_FAIL:
      //   return {
      //     ...state,
      //     isUpdating: false,
      //     errors: action.payload.error,
      //   };
      //
      // case types.CATEGORY_DELETE_REQUEST:
      //   return {
      //     ...state,
      //     isDeleting: true,
      //   };
      // case types.CATEGORY_DELETE_SUCCESS:
      //   const index = _findIndex(categories, { id: action.payload.id });
      //   if (index > -1) {
      //     categories.splice(index, 1);
      //   }
      //   return {
      //     ...state,
      //     isDeleting: false,
      //     categories: categories.slice(0),
      //     category: null,
      //   };
      // case types.CATEGORY_DELETE_FAIL:
      //   return {
      //     ...state,
      //     isDeleting: false,
      //     errors: action.payload.error,
      //   };
      //
      // case types.CATEGORY_SET:
      //   return {
      //     ...state,
      //     category: action.payload.category,
      //   };
      //
    case types.ATTRIBUTE_NODE_SET:
      console.log(action.payload);// fixme
      return {
        ...state,
        nodes: action.payload,
      };

    default:
      return state;
  }
};
