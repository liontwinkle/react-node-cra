import httpService from './http.service';

const getProductsRoute = (clientId, type) => `/clients/${clientId}/types/${type}/products`;

const fetch = (clientId, type, index) => httpService
  .get(`${getProductsRoute(clientId, type)}/${index}`)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));
const getLength = (clientId, type) => httpService
  .get(`${getProductsRoute(clientId, type)}`)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));
export default {
  fetch,
  getLength,
};
