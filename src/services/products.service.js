import httpService from './http.service';

const getProductsRoute = (clientId, type) => `/products/${clientId}/types/${type}/categories`;

const fetch = (clientId, type, index) => httpService
  .get(`${getProductsRoute(clientId, type)}/${index}`)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

export default {
  fetch,
};
