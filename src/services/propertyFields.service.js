import httpService from './http.service';

const basePropertyFiledsRoute = '/property_fields';

const fetch = (clientId, type) => httpService
  .get(`${basePropertyFiledsRoute}/${clientId}/${type}`)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const create = propertyField => httpService
  .post(basePropertyFiledsRoute, {
    propertyField,
  })
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));
//
// const update = (clientId, type, id, updatedData) => httpService
//   .put(`${getCategoryRoute(clientId, type)}/${id}`, updatedData)
//   .then(({ data }) => data)
//   .catch(err => Promise.reject(err.response));
//
// const remove = (clientId, type, id) => httpService
//   .remove(`${getCategoryRoute(clientId, type)}/${id}`)
//   .then(({ data }) => data)
//   .catch(err => Promise.reject(err.response));

export default {
  fetch,
  create,
  // update,
  // remove,
};
