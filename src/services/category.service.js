import httpService from './http.service';

const getCategoryRoute = (clientId, type) => `/clients/${clientId}/types/${type}/categories`;

const fetch = (clientId, type) => httpService
  .get(getCategoryRoute(clientId, type))
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const create = (clientId, type, category) => httpService
  .post(getCategoryRoute(clientId, type), category)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const updateDefaultData = (clientId, type, updateData) => httpService
  .post(`${getCategoryRoute(clientId, type)}/updatedefault`, updateData)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const update = (clientId, type, id, updatedData) => httpService
  .put(`${getCategoryRoute(clientId, type)}/${id}`, updatedData)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const remove = (clientId, type, id) => httpService
  .remove(`${getCategoryRoute(clientId, type)}/${id}`)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

export default {
  fetch,
  create,
  updateDefaultData,
  update,
  remove,
};
