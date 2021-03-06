import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import clientsData from './clients';
import categoriesData from './categories';
import productsData from './products';
import propertyFieldsData from './propertyFields';
import productsFieldsData from './productsFields';
import attributesData from './attribute';
import historyData from './history';
import uploadData from './upload';
import previewData from './preview';
import ruleData from './rules';

export default (history) => combineReducers({
  router: connectRouter(history),
  clientsData,
  categoriesData,
  propertyFieldsData,
  productsData,
  productsFieldsData,
  attributesData,
  historyData,
  uploadData,
  ruleData,
  previewData,
});
