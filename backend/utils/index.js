/* eslint-disable prefer-destructuring */
const db = require('mongoose').connection;
const _ = require('lodash');
const { ValidationError } = require('mongoose').Error;
const AppearCollection = require('../modules/appear/appear.model');

function insertAppear(collection, attributeId, appear) {
  const addAppearData = [];
  appear.forEach((item) => {
    addAppearData.push({
      attributeId,
      categoryId: item,
    });
  });
  collection.insertMany(addAppearData);
}

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

function handleCreate(req) {
  const collectionAppear = AppearCollection(`${req.client.code}_appears`);
  const collection = req.category;
  const createData = req.body;
  return (entity) => {
    let newId = 1;
    if (entity.length > 0) {
      entity.forEach((item) => {
        if (item.categoryId > newId) {
          newId = item.categoryId;
        }
      });
      newId++;
    }
    if (createData.parentId !== '') {
      collectionAppear.find({ categoryId: parseInt(createData.parentId, 10) })
        .then((result) => {
          if (result.length > 0) {
            const attributs = result.map(item => ({
              attributeId: item.attributeId,
              categoryId: newId,
            }));
            collectionAppear.insertMany(attributs)
              .then(() => {});
          }
        });
    }
    createData.categoryId = newId;
    return collection.create(createData);
  };
}

/**
 * To Handle creating the Attribute Made by Igor
 * It need to be required to handle two model `attributes` and `appears`
 * @param req
 * @returns {function(*): *}
 */
function handleAttributeCreate(req, res) {
  const createData = req.body;
  const collectionAttr = req.attributes;
  const collectionAppear = AppearCollection(`${req.client.code}_appears`);

  return (entity) => {
    let newId = 1;
    if (entity.length > 0) {
      entity.forEach((item) => {
        if (item.attributeId > newId) {
          newId = item.attributeId;
        }
      });
      newId++;
    }
    if (createData.appear) {
      insertAppear(collectionAppear, newId, createData.appear);
    }
    createData.attributeId = newId;
    collectionAttr.create(createData)
      .then((result) => {
        const returnValue = JSON.parse(JSON.stringify(result));
        returnValue.appear = createData.appear || [];
        res.status(201).json(returnValue);
      });
  };
}

function handleAttributeFetch(req, res) {
  const collectionAppear = AppearCollection(`${req.client.code}_appears`);
  return (entity) => {
    if (entity.length > 0) {
      const attributeData = JSON.parse(JSON.stringify(entity));
      collectionAppear.find()
        .then((result) => {
          if (result.length > 0) {
            entity.forEach((entityItem, index) => {
              attributeData[index].appear = result.filter((appearItem =>
                (appearItem.attributeId === entityItem.attributeId)
              )).map(item => (item.categoryId));
            });
            res.status(201).json(attributeData);
          } else {
            res.status(201).json(attributeData);
          }
        });
    } else {
      res.status(201).json(entity);
    }
  };
}

function saveUpdates(updates) {
  return (entity) => {
    if (updates) {
      _.assign(entity, updates);
    }
    return entity.saveAsync();
  };
}

function getAppear(appearArray) {
  return appearArray.map(item => item.categoryId);
}

function saveAttributeUpdates(req, res) {
  return (entity) => {
    const collectionAppear = AppearCollection(`${req.client.code}_appears`);

    /** *** Management of the group check status***** */
    collectionAppear.find({ attributeId: entity.attributeId }, { categoryId: 1, _id: 0 })
      .then((result) => {
        const old = getAppear(result);
        if (req.body) {
          if (!req.body.checked && entity.groupId !== '') {
            const diff = _.difference(old, req.body.appear);
            collectionAppear.find({
              attributeId: parseInt(entity.groupId, 10)
            }, { categoryId: 1, _id: 0 })
              .then((result) => {
                if (result.length > 0) {
                  const deletedAppear = _.difference(getAppear(result), diff);
                  if (deletedAppear.length > 0) {
                    collectionAppear.deleteMany({ attributeId: parseInt(entity.groupId, 10) })
                      .then(() => {
                        insertAppear(collectionAppear, parseInt(entity.groupId, 10), deletedAppear);
                      });
                  } else {
                    collectionAppear.deleteMany({ attributeId: parseInt(entity.groupId, 10) })
                      .then(() => {});
                  }
                }
              });
          }
          req.attributes.find({ groupId: entity.attributeId })
            .then((results) => {
              results.forEach((resItem) => {
                collectionAppear.find({
                  attributeId: resItem.attributeId
                }, { categoryId: 1, _id: 0 })
                  .then((result) => {
                    const newAppear = _.union(req.body.appear,
                      _.difference(getAppear(result), old));
                    collectionAppear.deleteMany({ attributeId: resItem.attributeId })
                      .then(() => {
                        insertAppear(collectionAppear, resItem.attributeId, newAppear);
                      });
                  });
              });
            });
        }
      });

    /** *** Update the Attributes and Apears Collection***** */
    _.assign(entity, req.body);
    const returnValue = JSON.parse(JSON.stringify(entity));

    collectionAppear.find({ attributeId: entity.attributeId })
      .then((result) => {
        if (req.body.appear) {
          if (result.length <= 0) {
            insertAppear(collectionAppear, entity.attributeId, req.body.appear);
            entity.saveAsync()
              .then(() => {
                returnValue.appear = req.body.appear;
                res.status(201).json(returnValue);
              });
          } else {
            collectionAppear.deleteMany({ attributeId: entity.attributeId })
              .then(() => {
                insertAppear(collectionAppear, entity.attributeId, req.body.appear);
                entity.saveAsync()
                  .then(() => {
                    returnValue.appear = req.body.appear;
                    res.status(201).json(returnValue);
                  });
              });
          }
        } else {
          entity.saveAsync()
            .then(() => {
              returnValue.appear = getAppear(result);
              res.status(201).json(returnValue);
            });
        }
      });
  };
}

function removeEntity(req, res) {
  const collectionAppear = AppearCollection(`${req.client.code}_appears`);
  return (entity) => {
    if (entity) {
      collectionAppear.find({ categoryId: entity.categoryId })
        .then((result) => {
          if (result.length > 0) {
            collectionAppear.deleteMany({ categoryId: entity.categoryId })
              .then(() => {});
          }
        });
      entity.removeAsync()
        .then(respondWith(res, 204));
    }
  };
}

function removeChildren(req, id) {
  const collectionAppear = AppearCollection(`${req.client.code}_appears`);
  req.category.find({ parentId: id })
    .then((result) => {
      if (result.length > 0) {
        req.category
          .deleteMany({ parentId: id }, (err, result) => {
            if (!result) {
              console.log(err);
            }
          });
        result.forEach((item) => {
          collectionAppear.find({ categoryId: item.categoryId })
            .then((result) => {
              if (result.length > 0) {
                collectionAppear.deleteMany({ categoryId: item.categoryId })
                  .then(() => {});
              }
            });
          removeChildren(req, item._id);
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
  handleCreate,
  handleAttributeCreate,
  handleAttributeFetch,
  removeEntity,
  createCollection,
  handleExistingRemove,
  saveAttributeUpdates,
};
