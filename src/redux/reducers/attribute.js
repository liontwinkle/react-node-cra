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
      const fetchedTrees = getAttribute(action.payload.attributes.sort());
      let convertedTrees = [];
      if (state.nodes.length > 0) {
        state.nodes.forEach((pItem, pKey) => {
          if (pItem.children.length > 0) {
            const cNewItem = [];
            pItem.children.forEach((cItem, cKey) => {
              cNewItem.push(cItem);
              cNewItem[cKey].item = fetchedTrees.subTree[pKey].children[cKey].item;
            });
            convertedTrees.push(pItem);
            convertedTrees[pKey].children = cNewItem;
            convertedTrees[pKey].item = fetchedTrees.subTree[pKey].item;
          } else {
            convertedTrees.push(pItem);
            convertedTrees[pKey].item = fetchedTrees.subTree[pKey].item;
          }
        });
        convertedTrees = _merge(fetchedTrees.subTree, convertedTrees);
      } else {
        convertedTrees = fetchedTrees.subTree;
      }
      return {
        ...state,
        isFetchingList: false,
        attributes: action.payload.attributes,
        attribute: state.attribute || action.payload.attributes[0] || null,
        associations: fetchedTrees.association,
        nodes: convertedTrees,
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
      let createdAttributes = JSON.parse(JSON.stringify(attributes));
      createdAttributes = [...createdAttributes, data];
      const createData = JSON.parse(JSON.stringify(getAttribute(createdAttributes)));
      const tempNodes = JSON.parse(JSON.stringify(state.nodes));
      const nodeData = _merge(createData.subTree, tempNodes);
      const nodeAssociation = _merge(createData.association, state.associations);
      return {
        ...state,
        isCreating: false,
        attributes: JSON.parse(JSON.stringify(createdAttributes.slice(0))),
        nodes: nodeData,
        associations: nodeAssociation,
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
      let updatedAttributes = JSON.parse(JSON.stringify(attributes));
      const attributesIdx = _findIndex(updatedAttributes, { id: updateData.id });
      if (attributesIdx > -1) {
        updatedAttributes[attributesIdx] = updateData;
      } else {
        updatedAttributes = [...updatedAttributes, updateData];
      }
      console.log('ATTRIBUTES : ', updatedAttributes); // fixme
      const newTrees = [];
      const recvTrees = getAttribute(updatedAttributes);
      state.nodes.forEach((pItem, pKey) => {
        if (pItem.children.length > 0) {
          const cNewItem = [];
          pItem.children.forEach((cItem, cKey) => {
            cNewItem.push({
              ...cItem,
              item: recvTrees.subTree[pKey].children[cKey].item,
              title: recvTrees.subTree[pKey].children[cKey].title,
            });
          });
          newTrees.push({
            ...pItem,
            children: cNewItem,
            item: recvTrees.subTree[pKey].item,
            title: recvTrees.subTree[pKey].title,
          });
        } else {
          newTrees.push({
            ...pItem,
            item: recvTrees.subTree[pKey].item,
            title: recvTrees.subTree[pKey].title,
          });
        }
      });

      return {
        ...state,
        isUpdating: false,
        attributes: JSON.parse(JSON.stringify(updatedAttributes)),
        nodes: newTrees,
        associations: recvTrees.association,
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
    default:
      return state;
  }
};
