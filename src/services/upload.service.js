import httpService from './http.service';

const getUploadRoute = (clientCode, clientId, type) => `/upload/${clientCode}/types/${type}/id/${clientId}`;

const upload = (clientCode, clientId, type, data) => httpService
  .post(getUploadRoute(clientCode, clientId, type), data)
  .then(({ data }) => data)
  .catch((err) => Promise.reject(err.response));
export default {
  upload,
};
