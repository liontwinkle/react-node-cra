import _merge from 'lodash/merge';
import _findIndex from 'lodash/findIndex';
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
      attributes.push(data);

      const nodeData = _merge(getAttribute(attributes), state.nodes);
      return {
        ...state,
        isCreating: false,
        attributes: attributes.slice(0),
        nodes: nodeData,
        attribute: action.payload.data,
      };
    case types.ATTRIBUTE_CREATE_FAIL:
      return {
        ...state,
        isCreating: false,
        errors: action.payload.error,
      };

    case types.ATTRIBUTE_UPDATE_REQUEST:
      return {
        ...state,
        isUpdating: true,
      };
    case types.ATTRIBUTE_UPDATE_SUCCESS:
      const updateData = action.payload.data;
      const attributesIdx = _findIndex(attributes, { id: updateData.id });
      if (attributesIdx > -1) {
        attributes.splice(attributesIdx, 1, updateData);
      } else {
        attributes.push(updateData);
      }
      const newTrees = _merge(state.trees, getAttribute(attributes));
      return {
        ...state,
        isUpdating: false,
        attributes: attributes.slice(0),
        nodes: newTrees,
        attribute: action.payload.data,
      };
    case types.ATTRIBUTE_UPDATE_FAIL:
      return {
        ...state,
        isUpdating: false,
        errors: action.payload.error,
      };

    case types.ATTRIBUTE_REMOVE_REQUEST:
      return {
        ...state,
        isDeleting: true,
      };
    case types.ATTRIBUTE_REMOVE_SUCCESS:
      const index = _findIndex(attributes, { id: action.payload.id });
      if (index > -1) {
        attributes.splice(index, 1);
      }
      return {
        ...state,
        isDeleting: false,
        attributes: attributes.slice(0),
        attribute: null,
      };
    case types.ATTRIBUTE_REMOVE_FAIL:
      return {
        ...state,
        isDeleting: false,
        errors: action.payload.error,
      };
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
