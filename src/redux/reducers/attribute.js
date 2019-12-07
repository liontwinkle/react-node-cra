import _findIndex from 'lodash/findIndex';
import {
  changePropertiesData, convertPropertyData, getAttribute, sortByField,
} from 'utils';
import types from '../actionTypes';

const INITIAL_STATE = {
  isFetchingList: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  attributes: [],
  nodes: [],
  attribute: null,
  associations: [],
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
      const recvAttributes = changePropertiesData(action.payload.attributes);
      recvAttributes.sort(sortByField('name'));
      const fetchedTrees = getAttribute(recvAttributes, state.nodes);

      return {
        ...state,
        isFetchingList: false,
        attributes: recvAttributes,
        attribute: state.attribute || recvAttributes.filter((item) => (item.group_id === null))[0] || null,
        associations: fetchedTrees.association,
        nodes: fetchedTrees.subTree,
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
      const data = convertPropertyData(action.payload.data);
      const createdAttributes = [data, ...attributes];
      const updateSaveData = getAttribute(createdAttributes, state.nodes);
      return {
        ...state,
        isCreating: false,
        attributes: JSON.parse(JSON.stringify(createdAttributes.slice(0))),
        nodes: updateSaveData.subTree,
        associations: updateSaveData.association,
        attribute: data,
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
      const updateData = convertPropertyData(action.payload.data);
      const attributesIdx = _findIndex(attributes, { _id: updateData._id });
      if (attributesIdx > -1) {
        attributes.splice(attributesIdx, 1, updateData);
      } else {
        attributes.push(updateData);
      }
      const recvTrees = getAttribute(attributes, state.nodes);

      return {
        ...state,
        isUpdating: false,
        attributes: JSON.parse(JSON.stringify(attributes.slice(0))),
        nodes: JSON.parse(JSON.stringify(recvTrees.subTree)),
        associations: JSON.parse(JSON.stringify(recvTrees.association)),
        attribute: updateData,
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
      const index = _findIndex(attributes, { _id: action.payload.id });
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

    case types.ATTRIBUTE_SET:
      return {
        ...state,
        attribute: action.payload.attribute,
      };

    case types.ATTRIBUTE_NODE_SET:
      return {
        ...state,
        nodes: action.payload,
      };

    case types.ATTRIBUTE_UPDATE_DEFAULT_REQUEST:
      return {
        ...state,
        isUpdating: true,
      };
    case types.ATTRIBUTE_UPDATE_DEFAULT_SUCCESS:
      return {
        ...state,
        isUpdating: false,
      };
    case types.ATTRIBUTE_UPDATE_DEFAULT_FAIL:
      return {
        ...state,
        isUpdating: false,
        errors: action.payload.error,
      };
    default:
      return state;
  }
};
