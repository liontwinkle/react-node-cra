import types from '../actionTypes';

const INITIAL_STATE = {
  selectedCategory: {},
  rootCategories: [],
  urlPath: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SET_PREVIEW_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload,
      };
    case types.SET_ROOT_CATEGORY:
      return {
        ...state,
        rootCategories: action.payload,
      };
    case types.SET_URL_PATH_NAV:
      let urlPathData = JSON.parse(JSON.stringify(state.urlPath));
      const recvData = action.payload;

      const findIndex = urlPathData.findIndex((item) => (item.id === action.payload.subParentId));
      if (findIndex < 0) {
        urlPathData = [];
      } else {
        urlPathData.splice(findIndex + 1, urlPathData.length - findIndex);
      }
      if (recvData.subParentId && recvData.parent_id) {
        urlPathData.push({
          name: recvData.parent_name,
          id: recvData.parent_id,
          parent_id: recvData.subParentId,
        });
      }
      urlPathData.push({
        name: recvData.name,
        id: recvData.id,
        parent_id: recvData.parent_id,
      });
      return {
        ...state,
        urlPath: urlPathData,
      };
    default:
      return state;
  }
};
