const _ = require('lodash');
const ValidationError = require('mongoose').Error.ValidationError;

function handleError(res, statusCode = 500) {
  return err => {
    if (err) {
      if (err.statusCode) {
        statusCode = err.statusCode;
      } else if (err instanceof ValidationError) {
        statusCode = 422;
      }

      console.error(err);
      res.status(statusCode);
      res.send(err);
    }
  };
}

function respondWith(res, statusCode = 200) {
  return () => {
    res.status(statusCode).end();
  };
}

function responseWithResult(res, statusCode = 200) {
  return entity => {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res, req) {
  return entity => {
    if (!entity) {
      res.status(404).end();
      return Promise.reject(entity);
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return entity => {
    if (updates) {
      _.assign(entity, updates);
    }
    return entity.saveAsync();
  };
}

function removeEntity(res) {
  return entity => entity && entity.removeAsync().then(respondWith(res, 204));
}

module.exports = {
  handleError,
  respondWith,
  responseWithResult,
  handleEntityNotFound,
  saveUpdates,
  removeEntity,
};