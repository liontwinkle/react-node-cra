import _difference from 'lodash/difference';
import types from '../actionTypes';

const INITIAL_STATE = {
  isFetchingList: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  history: [],
  errors: '',
};

export default (state = INITIAL_STATE, action) => {
  const { history } = state;

  switch (action.type) {
    case types.HISTORY_FETCH_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.HISTORY_FETCH_SUCCESS:
      return {
        ...state,
        isFetchingList: false,
        history: action.payload.data,
      };
    case types.HISTORY_FETCH_FAIL:
      return {
        ...state,
        isFetchingList: false,
        errors: action.payload.error,
      };

    case types.HISTORY_CREATE_REQUEST:
      return {
        ...state,
        isCreating: true,
      };
    case types.HISTORY_CREATE_SUCCESS:
      const { data } = action.payload;
      history.push(data);

      return {
        ...state,
        isCreating: false,
        history,
      };
    case types.HISTORY_CREATE_FAIL:
      return {
        ...state,
        isCreating: false,
        errors: action.payload.error,
      };

    case types.HISTORY_REMOVE_REQUEST:
      return {
        ...state,
        isDeleting: true,
      };
    case types.HISTORY_REMOVE_SUCCESS:
      const filteredData = history.filter(historyItem => (historyItem.itemId === action.payload.id));
      const updatedHistory = _difference(history, filteredData);
      return {
        ...state,
        isDeleting: false,
        history: updatedHistory,
      };
    case types.HISTORY_REMOVE_FAIL:
      return {
        ...state,
        isDeleting: false,
        errors: action.payload.error,
      };
    default:
      return state;
  }
};
