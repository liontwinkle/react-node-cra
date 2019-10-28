import httpService from './http.service';

const getAttributesRoute = (clientId, type) => `/clients/${clientId}/types/${type}/attributes`;

const fetch = (clientId, type) => httpService
  .get(getAttributesRoute(clientId, type))
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const create = (clientId, type, category) => httpService
  .post(getAttributesRoute(clientId, type), category)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const update = (clientId, type, id, updatedData) => httpService
  .put(`${getAttributesRoute(clientId, type)}/${id}`, updatedData)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const updateDefaultData = (clientId, type, updateData) => httpService
  .post(`${getAttributesRoute(clientId, type)}/updatedefault`, updateData)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const remove = (clientId, type, id) => httpService
  .remove(`${getAttributesRoute(clientId, type)}/${id}`)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const removeAppear = (clientId, type, id) => httpService
  .post(`${getAttributesRoute(clientId, type)}/appear/`, { appearId: id })
  .then(() => {})
  .catch(err => Promise.reject(err.response));

const updateAppear = (clientId, type, idData) => httpService
  .post(`${getAttributesRoute(clientId, type)}/appear`, idData)
  .then(() => {})
  .catch(err => Promise.reject(err.response));
export default {
  fetch,
  create,
  update,
  remove,
  updateDefaultData,
  removeAppear,
  updateAppear,
};
