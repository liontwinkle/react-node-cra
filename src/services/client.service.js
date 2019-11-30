import httpService from './http.service';

const fetch = () => httpService
  .get('/clients')
  .then(({ data }) => data)
  .catch((err) => Promise.reject(err.response));

const create = (client) => httpService
  .post('/clients', client)
  .then(({ data }) => data)
  .catch((err) => Promise.reject(err.response));

const update = (clientId, updatedData) => httpService
  .put(`/clients/${clientId}`, updatedData)
  .then(({ data }) => data)
  .catch((err) => Promise.reject(err.response));

const remove = (clientId) => httpService
  .remove(`/clients/${clientId}`)
  .then(({ data }) => data)
  .catch((err) => Promise.reject(err.response));

export default {
  fetch,
  create,
  update,
  remove,
};
