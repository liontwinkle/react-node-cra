import httpService from './http.service';

const getCategoryRoute = '/products-fields';

const fetch = (clientId) => httpService
  .get(`${getCategoryRoute}/${clientId}`)
  .then(({ data }) => data)
  .catch((err) => Promise.reject(err.response));

const update = (clientId, updatedData) => httpService
  .put(`${getCategoryRoute}/${clientId}`, updatedData)
  .then(({ data }) => data)
  .catch((err) => Promise.reject(err.response));

const updateImageKey = (clientId, ImageKey) => httpService
  .put(`${getCategoryRoute}/key/${clientId}`, ImageKey)
  .then(({ data }) => data)
  .catch((err) => Promise.reject(err.response));
const remove = (clientId) => httpService
  .remove(`${getCategoryRoute}/${clientId}`)
  .then(({ data }) => data)
  .catch((err) => Promise.reject(err.response));

export default {
  fetch,
  update,
  updateImageKey,
  remove,
};
