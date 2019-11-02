/* eslint-disable prefer-destructuring */
const db = require('mongoose').connection;
const _ = require('lodash');
const { ValidationError } = require('mongoose').Error;
const fs = require('fs');

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
      createData.defaultProperties = entity[0].defaultProperties || [];
      entity.forEach((item) => {
        if (item.categoryId > newId) {
          newId = item.categoryId;
        }
      });
      newId++;
    }
    if (createData.parentId !== 'null') {
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

function setAppearForCategory(data, client) {
  const collectionAppear = AppearCollection(`${client}_appears`);
  data.forEach((item) => {
    if (item.parentId !== 'null') {
      collectionAppear.find({ categoryId: parseInt(item.parentId, 10) })
        .then((result) => {
          if (result.length > 0) {
            const attributs = result.map(attributeItem => ({
              attributeId: attributeItem.attributeId,
              categoryId: item.categoryId,
            }));
            collectionAppear.insertMany(attributs)
              .then(() => {});
          }
        });
    }
  });
}
/**
 * To Handle creating the Attribute Made by Igor
 * It need to be required to handle two model `attributes` and `appears`
 * @param req
 * @param res
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
          entity.forEach((entityItem, index) => {
            if (result.length > 0) {
              attributeData[index].appear = result.filter((appearItem =>
                (appearItem.attributeId === entityItem.attributeId)
              ))
                .map(item => (item.categoryId));
            } else {
              attributeData[index].appear = [];
            }
          });
          res.status(201).json(attributeData);
        });
    } else {
      res.status(201).json(entity);
    }
  };
}

function uploadImageProperties(data, clientId, type) {
  console.log('##### DATA: ', data); // fixme
  const fields = [];
  data.forEach((item) => {
    if (!item.image.imageData) {
      fields.push((item));
    } else {
      const dir = `./images/${clientId}/${type}`;
      const fileName = item.image.path;
      const fileData = item.image.imageData;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.writeFile(`${dir}/${fileName}`, fileData, (err) => {
        if (err) {
          return console.log(err);
        }
      });
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

function savePropertiesUpdates(updates) {
  return (entity) => {
    if (updates) {
      const data = uploadImageProperties(updates, entity.clientId, entity.type);
      _.assign(entity, data);
    }
    return entity.saveAsync();
  };
}

function getAppear(appearArray) {
  return appearArray.map(item => item.categoryId);
}

function checkOffForAttribute(oldData, req, collection, entity) {
  const diff = _.difference(oldData, req.body.appear);
  collection.find({
    attributeId: parseInt(entity.groupId, 10)
  }, { categoryId: 1, _id: 0 })
    .then((result) => {
      if (result.length > 0) {
        const deletedAppear = _.difference(getAppear(result), diff);
        if (deletedAppear.length > 0) {
          collection.deleteMany({ attributeId: parseInt(entity.groupId, 10) })
            .then(() => {
              insertAppear(collection, parseInt(entity.groupId, 10), deletedAppear);
            });
        } else {
          collection.deleteMany({ attributeId: parseInt(entity.groupId, 10) })
            .then(() => {});
        }
      }
    });
}

function updateChildAttributesAppear(req, entity, collection, oldData) {
  req.attributes.find({ groupId: entity.attributeId })
    .then((results) => {
      results.forEach((resItem) => {
        collection.find({
          attributeId: resItem.attributeId
        }, { categoryId: 1, _id: 0 })
          .then((result) => {
            const newAppear = _.union(req.body.appear,
              _.difference(getAppear(result), oldData));
            collection.deleteMany({ attributeId: resItem.attributeId })
              .then(() => {
                insertAppear(collection, resItem.attributeId, newAppear);
              });
          });
      });
    });
}

function updateAttributesAppear(req, res, result, collection, entity, returnValue) {
  if (req.body.appear) {
    if (result.length <= 0) {
      insertAppear(collection, entity.attributeId, req.body.appear);
      entity.saveAsync()
        .then(() => {
          returnValue.appear = req.body.appear;
          res.status(201).json(returnValue);
        });
    } else {
      collection.deleteMany({ attributeId: entity.attributeId })
        .then(() => {
          insertAppear(collection, entity.attributeId, req.body.appear);
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
}

function saveAttributeUpdates(req, res) {
  return (entity) => {
    const collectionAppear = AppearCollection(`${req.client.code}_appears`);

    /** *** Management of the group check status***** */
    if (req.body.appear) {
      collectionAppear.find({ attributeId: entity.attributeId }, { categoryId: 1, _id: 0 })
        .then((result) => {
          const old = getAppear(result);
          if (!req.body.checked && entity.groupId !== 'null') {
            checkOffForAttribute(old, req, collectionAppear, entity);
          }
          updateChildAttributesAppear(req, entity, collectionAppear, old);
        });
    }

    /** *** Update the Attributes and Appears Collection***** */
    _.assign(entity, req.body);
    const returnValue = JSON.parse(JSON.stringify(entity));

    collectionAppear.find({ attributeId: entity.attributeId })
      .then((result) => {
        updateAttributesAppear(req, res, result, collectionAppear, entity, returnValue);
      });
  };
}

function uploadAppear(data, client) {
  const collectionAppear = AppearCollection(`${client}_appears`);
  data.forEach((dataItem) => {
    if (dataItem.appear) {
      insertAppear(collectionAppear, dataItem.attributeId, dataItem.appear);
    }
  });
}
function removeCategoryEntity(req, res) {
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

function removeEntity(res) {
  return entity => entity && entity.removeAsync()
    .then(respondWith(res, 204));
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
  savePropertiesUpdates,
  handleCreate,
  handleAttributeCreate,
  handleAttributeFetch,
  removeEntity,
  removeCategoryEntity,
  createCollection,
  handleExistingRemove,
  saveAttributeUpdates,
  uploadAppear,
  setAppearForCategory,
};
