import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import clientsData from './clients';
import categoriesData from './categories';

export default history => combineReducers({
  router: connectRouter(history),
  clientsData,
  categoriesData,
});