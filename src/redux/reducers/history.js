import types from '../actionTypes';

const INITIAL_STATE = {
  isFetchingList: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  histories: [],
  errors: '',
};

export default (state = INITIAL_STATE, action) => {
  // const { histories } = state;

  switch (action.type) {
    case types.HISTORY_FETCH_REQUEST:
      return {
        ...state,
        isFetchingList: true,
      };
    case types.HISTORY_FETCH_SUCCESS:
      console.log('############# DEBUG START FETCH ##################'); // fixme
      console.log('## DEBUG FETCH DATA: ', action.payload.data); // fixme
      break;
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
      console.log('################ DEBUG START CREATE ###########'); // fixme
      const { data } = action.payload;
      console.log('## DEBUG: ', data); // fixme
      break;
    case types.HISTORY_CREATE_FAIL:
      return {
        ...state,
        isCreating: false,
        errors: action.payload.error,
      };

    case types.HISTORY_UPDATE_REQUEST:
      return {
        ...state,
        isUpdating: true,
      };
    case types.HISTORY_UPDATE_SUCCESS:
      console.log('################ DEBUG START UPDATE ###########'); // fixme
      const updateData = action.payload.data;
      console.log('## DEBUG UPDATE: ', updateData); // fixme
      break;
    case types.HISTORY_UPDATE_FAIL:
      return {
        ...state,
        isUpdating: false,
        errors: action.payload.error,
      };

    case types.HISTORY_REMOVE_REQUEST:
      return {
        ...state,
        isDeleting: true,
      };
    case types.HISTORY_REMOVE_SUCCESS:
      console.log('################## DEBUG START HISTORY ################');
      // const index = _findIndex(attributes, { id: action.payload.id });
      console.log('## DEBUG REMOVE: ', action.payload);
      // if (index > -1) {
      //   attributes.splice(index, 1);
      // }
      // return {
      //   ...state,
      //   isDeleting: false,
      //   attributes: attributes.slice(0),
      //   attribute: null,
      // };
      break;
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
