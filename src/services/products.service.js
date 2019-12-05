import httpService from './http.service';

const getProductsRoute = (clientId, type) => `/clients/${clientId}/types/${type}/products`;

const fetch = (clientId, type) => httpService
  .get(`${getProductsRoute(clientId, type)}`)
  .then(({ data }) => data)
  .catch((err) => Promise.reject(err.response));

const update = (clientId, type, updatedData) => httpService
  .put(`${getProductsRoute(clientId, type)}`, updatedData)
  .then(({ data }) => data)
  .catch((err) => Promise.reject(err.response));

export default {
  fetch,
  update,
};
