import httpService from './http.service';

const getUploadRoute = (clientId, type) => `/upload/${clientId}/types/${type}`;

const upload = (clientId, type, data) => httpService
  .post(getUploadRoute(clientId, type), data)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

export default {
  upload,
};
