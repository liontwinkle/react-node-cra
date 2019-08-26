import httpService from './http.service';

const getCategoryRoute = '/products_field';

const fetch = clientId => httpService
  .get(`${getCategoryRoute}/${clientId}`)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const update = (clientId, updatedData) => httpService
  .put(`${getCategoryRoute}/${clientId}`, updatedData)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const remove = clientId => httpService
  .remove(`${getCategoryRoute}/${clientId}`)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

export default {
  fetch,
  update,
  remove,
};
