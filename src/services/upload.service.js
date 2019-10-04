import httpService from './http.service';

const getUploadRoute = (clientId, type) => `/upload/${clientId}/types/${type}`;
const getKeyUploadRoute = (clientId, type) => `/upload/key/${clientId}/types/${type}`;

const upload = (clientId, type, data) => httpService
  .post(getUploadRoute(clientId, type), data)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));

const keyUpload = (clientId, type, data) => httpService
  .post(getKeyUploadRoute(clientId, type), data)
  .then(({ data }) => data)
  .catch(err => Promise.reject(err.response));
export default {
  upload,
  keyUpload,
};
