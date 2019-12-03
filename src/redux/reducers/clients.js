import _findIndex from 'lodash/findIndex';

import { productViewTypes } from 'utils/constants';
import types from '../actionTypes';

const INITIAL_STATE = {
  isFetchingList: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  clients: [],
  client: null,
  type: null,
  productViewType: productViewTypes[0],
  errors: '',
};

export default (state = INITIAL_STATE, action) => {
  const { clients } = state;

  switch (action.type) {
    case types.CLIENTS_GET_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.CLIENTS_GET_SUCCESS:
      const recvData = action.payload.clients;
      const getClients = [];
      recvData.forEach((item) => {
        if (item.active) {
          getClients.push(item);
        }
      });
      return {
        ...state,
        isFetchingList: false,
        clients: getClients,
      };
    case types.CLIENTS_GET_FAIL:
      return {
        ...state,
        isFetchingList: false,
        errors: action.payload.error,
      };

    case types.CLIENT_CREATE_REQUEST:
      return {
        ...state,
        isCreating: true,
      };
    case types.CLIENT_CREATE_SUCCESS:
      clients.push(action.payload.data);
      return {
        ...state,
        isCreating: false,
        clients: clients.slice(0),
      };
    case types.CLIENT_CREATE_FAIL:
      return {
        ...state,
        isCreating: false,
        errors: action.payload.error,
      };

    case types.CLIENT_UPDATE_REQUEST:
      return {
        ...state,
        isUpdating: true,
      };
    case types.CLIENT_UPDATE_SUCCESS:
      return {
        ...state,
        isUpdating: false,
      };
    case types.CLIENT_UPDATE_FAIL:
      return {
        ...state,
        isUpdating: false,
        errors: action.payload.error,
      };

    case types.CLIENT_DELETE_REQUEST:
      return {
        ...state,
        isDeleting: true,
      };
    case types.CLIENT_DELETE_SUCCESS:
      const index = _findIndex(clients, { id: action.payload.id });
      if (index > -1) {
        clients.splice(index, 1);
      }
      return {
        ...state,
        isDeleting: false,
        clients: clients.slice(0),
        client: null,
      };
    case types.CLIENT_DELETE_FAIL:
      return {
        ...state,
        isDeleting: false,
        errors: action.payload.error,
      };

    case types.CLIENT_SET:
      return {
        ...state,
        client: action.payload.client,
        type: null,
      };

    case types.CLIENT_SET_TYPE:
      return {
        ...state,
        type: action.payload.type,
      };

    case types.CLIENT_SET_PRODUCT_VIEW_TYPE:
      return {
        ...state,
        productViewType: action.payload.productViewType,
      };
    default:
      return state;
  }
};
