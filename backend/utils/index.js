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
    res.status(statusCode)
      .end();
  };
}

function responseWithResult(res, statusCode = 200) {
  return (entity) => {
    if (entity) {
      res.status(statusCode)
        .json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return (entity) => {
    if (!entity) {
      res.status(404)
        .end();
      return Promise.reject(entity);
    }
    return entity;
  };
}

function handleExistingRemove(collection, req, res) {
  collection.find({ clientId: req.params.clientId }, (err, findRes) => {
    if (!err) {
      if (findRes.length > 0) {
        collection.updateOne({ clientId: req.params.clientId },
          {
            $set: {
              clientId: req.params.clientId,
              imageKey: req.body.imageKey,
              fields: req.body.fields,
            }
          }, (err, findRes) => {
            if (!err) {
              res.status(200)
                .json(findRes);
            }
          });
      } else {
        collection.create({
          clientId: req.params.clientId,
          imageKey: req.body.imageKey,
          fields: req.body.fields,
        }, (err, insertResult) => {
          if (!err) {
            res.status(200)
              .json(insertResult);
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

function saveAttributeUpdates(req) {
  return (entity) => {
    const old = entity.appear;
    if (req.body) {
      if (!req.body.checked && entity.groupId !== '') {
        req.attributes.find({ _id: entity.groupId })
          .then((result) => {
            if (result.length > 0) {
              const diff = _.difference(old, req.body.appear);
              const deletedAppear = _.intersection(result.appear, diff);
              req.attributes.update({ _id: result._id }, { $set: { appear: deletedAppear } })
                .then(() => {});
            }
          });
      }
      req.attributes.find({ groupId: entity._id })
        .then((results) => {
          results.forEach((resItem) => {
            const newAppear = _.union(req.body.appear,
              _.difference(resItem.appear, old));
            req.attributes.update({ _id: resItem._id }, { $set: { appear: newAppear } })
              .then(() => {});
          });
        });
    }
    _.assign(entity, req.body);
    return entity.saveAsync();
  };
}

function removeEntity(res) {
  return entity => entity && entity.removeAsync()
    .then(respondWith(res, 204));
}

function removeChildren(req, id) {
  req.category.find({ parentId: id })
    .then((result) => {
      req.category
        .deleteMany({ parentId: id }, (err, result) => {
          if (!result) {
            console.log(err);
          }
        });
      if (result.length > 0) {
        result.forEach((item) => {
          removeChildren(req, item._id);
        });
      } else {
        req.category
          .deleteOne({ parentId: id }, (err, result) => {
            if (!result) {
              console.log(err);
            }
          });
      }
    });
}

function removeAttribute(req, id) {
  req.attributes.find({ groupId: id })
    .then((result) => {
      req.attributes
        .deleteMany({ groupId: id }, (err, result) => {
          if (!result) {
            console.log(err);
          }
        });
      if (result.length > 0) {
        result.forEach((item) => {
          removeChildren(req, item._id);
        });
      } else {
        req.attributes
          .deleteOne({ groupId: id }, (err, result) => {
            if (!result) {
              console.log(err);
            }
          });
      }
    });
}
function createCollection(body) {
  const fileName = [
    `${body.code}_virtuals`,
    `${body.code}_natives`,
    `${body.code}_products`,
    `${body.code}_attributes`,
    `${body.code}_histories`,
  ];
  fileName.forEach((item) => {
    db.createCollection(item, () => {
    });
  });
}

module.exports = {
  handleError,
  respondWith,
  removeChildren,
  removeAttribute,
  responseWithResult,
  handleEntityNotFound,
  saveUpdates,
  removeEntity,
  createCollection,
  handleExistingRemove,
  saveAttributeUpdates,
};
