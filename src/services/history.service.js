import httpService from './http.service';

const type = 'history';
const getHistoryRoute = clientId => `/clients/${clientId}/types/${type}/history`;

const fetch = (clientId, type) => httpService
  .get(`${getHistoryRoute(clientId)}/item/${type}`)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const create = (clientId, history) => httpService
  .post(getHistoryRoute(clientId), history)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const update = (clientId, id, updatedData) => httpService
  .put(`${getHistoryRoute(clientId)}/${id}`, updatedData)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const remove = (clientId, id) => httpService
  .remove(`${getHistoryRoute(clientId)}/${id}`)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

export default {
  fetch,
  create,
  update,
  remove,
};
