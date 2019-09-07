/* eslint-disable prefer-destructuring */
const db = require('mongoose').connection;
const _ = require('lodash');
const { ValidationError } = require('mongoose').Error;

function handleError(res, statusCode = 500) {
  return (err) => {
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
  return (entity) => {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return (entity) => {
    if (!entity) {
      res.status(404).end();
      return Promise.reject(entity);
    }
    return entity;
  };
}

function handleExistingRemove(collection, req, newData, res) {
  collection.find({ clientId: req.params.clientId }, (err, findRes) => {
    if (!err) {
      if (findRes.length > 0) {
        collection.deleteMany({ clientId: req.params.clientId }, () => {
          collection.create(newData, (err, insertResult) => {
            if (!err) {
              res.status(200).json(insertResult);
            }
          });
        });
      } else {
        collection.create(newData, (err, insertResult) => {
          if (!err) {
            res.status(200).json(insertResult);
          }
        });
      }
    }
  });
}

function saveUpdates(updates) {
  return (entity) => {
    if (updates) {
      _.assign(entity, updates);
    }
    return entity.saveAsync();
  };
}


function removeEntity(res) {
  return entity => entity && entity.removeAsync().then(respondWith(res, 204));
}

function removeChildren(req, id) {
  req.category.find({ parentId: id }).then((result) => {
    req.category
      .deleteMany({ parentId: id }, () => {
      });
    if (result.length > 0) {
      result.forEach((item) => {
        removeChildren(req, item._id);
      });
    } else {
      req.category
        .deleteOne({ parentId: id }, () => {
        });
    }
  });
}

function createCollection(body) {
  const fileName = [
    `${body.code}_virtuals`,
    `${body.code}_native`,
    `${body.code}_products`,
    `${body.code}_attributes`,
  ];
  fileName.forEach((item) => {
    db.createCollection(item, () => {});
  });
}

module.exports = {
  handleError,
  respondWith,
  removeChildren,
  responseWithResult,
  handleEntityNotFound,
  saveUpdates,
  removeEntity,
  createCollection,
  handleExistingRemove,
};
