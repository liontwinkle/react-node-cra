/* eslint-disable prefer-destructuring */
const db = require('mongoose').connection;
const _ = require('lodash');
const { ValidationError } = require('mongoose').Error;
const fs = require('fs');
const base64ToImage = require('base64-to-image');

const AppearCollection = require('../modules/appear/appear.model');

function checkObject(data) {
  return (typeof data === 'object') && !Array.isArray(data) && (data !== null);
}

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
        if (item._id > newId) {
          newId = item._id;
        }
      });
      newId++;
    }
    if (createData.parent_id) {
      collectionAppear.find({ categoryId: createData.parent_id })
        .then((result) => {
          if (result.length > 0) {
            const attributs = result.map((item) => ({
              attributeId: item.attributeId,
              categoryId: newId,
            }));
            collectionAppear.insertMany(attributs)
              .then(() => {});
          }
        });
    }
    createData._id = newId;
    return collection.create(createData);
  };
}

function setAppearForCategory(data, client) {
  const collectionAppear = AppearCollection(`${client}_appears`);
  data.forEach((item) => {
    if (item.parent_id !== null) {
      collectionAppear.find({ categoryId: item.parent_id })
        .then((result) => {
          if (result.length > 0) {
            const attributs = result.map((attributeItem) => ({
              attributeId: attributeItem._id,
              categoryId: item._id,
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
        if (item._id > newId) {
          newId = item._id;
        }
      });
      newId++;
    }
    if (createData.appear) {
      insertAppear(collectionAppear, newId, createData.appear);
    }
    createData._id = newId;
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
              attributeData[index].appear = result.filter(((appearItem) =>
                (appearItem.attributeId === entityItem._id)
              ))
                .map((item) => (item.categoryId));
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

function removeDeletedProperty(data, deleteKey, collection) {
  data.forEach((resultItem) => {
    if (resultItem.properties) {
      const keys = Object.keys(resultItem.properties);
      keys.forEach((keyItem) => {
        if (checkObject(resultItem.properties[keyItem])) {
          const subObject = JSON.parse(JSON.stringify(resultItem.properties[keyItem]));
          const subKeys = Object.keys(subObject);
          subKeys.forEach((subKeyItem) => {
            if (subKeyItem === deleteKey) {
              delete subObject[subKeyItem];
            }
          });
          resultItem.properties[keyItem] = subObject;
        } else if (keyItem === deleteKey) {
          delete resultItem.properties[deleteKey];
        }
      });

      collection.updateMany({ _id: resultItem._id }, {
        $set: {
          properties: resultItem.properties
        }
      }, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
}
function uploadImageProperties(data, clientId, type) {
  if (data.propertyFields) {
    data.propertyFields.forEach((item, index) => {
      if (item.image && item.image.imageData) {
        const dir = `/images/${clientId}/${type}/default`;
        const fileName = `${item.key}_${item.image.path}`;
        const fileType = item.image.type.split('/')[1];
        const imageType = { fileName, type: fileType }; // Png, Jpg, Jpeg

        if (!fs.existsSync('../public/images')) {
          fs.mkdirSync('../public/images');
        }
        if (!fs.existsSync(`../public/images/${clientId}`)) {
          fs.mkdirSync(`../public/images/${clientId}`);
        }
        if (!fs.existsSync(`../public/images/${clientId}/${type}`)) {
          fs.mkdirSync(`../public/images/${clientId}/${type}`);
        }
        if (!fs.existsSync(`../public/images/${clientId}/${type}/default`)) {
          fs.mkdirSync(`../public/images/${clientId}/${type}/default`);
        }
        base64ToImage(item.image.imageData, `../public/${dir}/`, imageType);
        const updatedData = item;
        const image = item.image;
        delete image.imageData;
        image.path = `${dir}/${fileName}`;
        updatedData.image = image;
        data.propertyFields[index] = updatedData;
      }
    });
  }
  return data;
}

function deleteFile(url) {
  try {
    fs.unlinkSync(url);
  } catch (err) {
    console.error(err);
  }
}

function removeImageUploaded(originData, newData) {
  let diffData = null;
  for (let index = 0; index < originData.length; index++) {
    if (newData.findIndex((newItem) => (newItem.key === originData[index].key)) < 0) {
      diffData = originData[index];
      break;
    }
  }
  if (diffData && diffData.image) {
    deleteFile(`../public/images/${diffData.image.path}`);
  }
}

function updateFile(clientId, type, url, id) {
  const copyUrl = url.replace(/\/default\//g, `/${id}/`);
  const destUrl = `/images/${clientId}/${type}/${id}`;
  if (!fs.existsSync(`../public${destUrl}`)) {
    fs.mkdirSync(`../public${destUrl}`);
  }
  if (`../public${url}` !== `../public${copyUrl}`) {
    fs.copyFile(`../public${url}`, `../public${copyUrl}`, (err) => {
      if (err) {
        throw err;
      }
    });
  }
  return copyUrl;
}

function createFile(clientId, type, data, key, categoryId, originUrl) {
  if (data && data.imageData) {
    if (originUrl) {
      deleteFile(`../public/${originUrl}`);
    }
    const dir = `/images/${clientId}/${type}/${categoryId}`;
    const fileName = `${key}_${data.path}`;
    const fileType = data.type.split('/')[1];
    const imageType = { fileName, type: fileType }; // Png, Jpg, Jpeg

    if (!fs.existsSync('../public/images')) {
      fs.mkdirSync('../public/images');
    }
    if (!fs.existsSync(`../public/images/${clientId}`)) {
      fs.mkdirSync(`../public/images/${clientId}`);
    }
    if (!fs.existsSync(`../public/images/${clientId}/${type}`)) {
      fs.mkdirSync(`../public/images/${clientId}/${type}`);
    }
    if (!fs.existsSync(`../public/images/${clientId}/${type}/${categoryId}`)) {
      fs.mkdirSync(`../public/images/${clientId}/${type}/${categoryId}`);
    }
    base64ToImage(data.imageData, `../public/${dir}/`, imageType);
    const image = data;
    delete image.imageData;
    image.path = `${dir}/${fileName}`;
    return image;
  }
}
function prepareImageProperties(originData, updates, clientId, type) {
  const originProperties = (originData.properties)
    ? JSON.parse(JSON.stringify(originData.properties))
    : null;
  const updateProperties = JSON.parse(JSON.stringify(updates.properties));
  const updatedNewProperties = JSON.parse(JSON.stringify(updates));
  const dataKeys = Object.keys(updateProperties);
  dataKeys.forEach((keyItem) => {
    if (typeof updateProperties[keyItem] === 'object'
      && updateProperties[keyItem] !== null
      && !Array.isArray(updateProperties[keyItem])
    ) {
      const subKeys = Object.keys(updateProperties[keyItem]);
      subKeys.forEach((subKeyItem) => {
        if (!originProperties || !originProperties[keyItem]
          || originProperties[keyItem][subKeyItem] !== updateProperties[keyItem][subKeyItem]) {
          if (updateProperties[keyItem][subKeyItem] && updateProperties[keyItem][subKeyItem].path) {
            if (!updateProperties[keyItem][subKeyItem].imageData) {
              updatedNewProperties.properties[keyItem][subKeyItem].path = updateFile(clientId,
                type, updateProperties[keyItem][subKeyItem].path,
                originData._id);
            } else {
              const originUrl = (originProperties[keyItem]
                && originProperties[keyItem][subKeyItem])
                ? originProperties[keyItem][subKeyItem].path : null;
              updatedNewProperties.properties[keyItem][subKeyItem] = createFile(clientId,
                type,
                updateProperties[keyItem][subKeyItem],
                subKeyItem, originData._id, originUrl);
            }
          }
        }
      });
    } else if (updateProperties[keyItem] && updateProperties[keyItem].path) {
      if (!updateProperties[keyItem].imageData) {
        updatedNewProperties.properties[keyItem].path = updateFile(clientId,
          type, updates[keyItem].path, originData._id);
      } else {
        updatedNewProperties.properties[keyItem] = createFile(clientId,
          type,
          updateProperties[keyItem],
          keyItem, originData._id);
      }
    }
  });
  return updatedNewProperties;
}

function saveCategoriesUpdates(req) {
  return (entity) => {
    if (req.body) {
      const originData = JSON.parse(JSON.stringify(entity));
      let data = req.body;
      if (req.body.properties) {
        data = prepareImageProperties(originData, req.body, req.client._id, 'virtual');
      }
      _.assign(entity, data);
    }
    return entity.saveAsync();
  };
}

function getDiffSection(oldsection, newSection) {
  let newKey = '';
  let originalKey = '';
  oldsection.forEach((oldItem) => {
    const duplicateId = newSection.findIndex((newItem) => (
      (oldItem.key === newItem.key) && (oldItem.label === newItem.label)
    ));
    if (duplicateId < 0) {
      originalKey = oldItem.key;
      const updatedSection = newSection.find((newItem) => (newItem._id === oldItem._id));
      if (updatedSection) {
        newKey = updatedSection.key;
      } else {
        newKey = null;
      }
    }
  });
  return {
    newKey,
    originalKey,
  };
}

function setNewKey(propertyFields, newKey, originalKey) {
  const newPropertyFields = JSON.parse(JSON.stringify(propertyFields));
  propertyFields.forEach((item, index) => {
    if (item.section === originalKey) {
      newPropertyFields[index].section = newKey;
    }
  });
  return newPropertyFields;
}
function savePropertiesUpdates(updates) {
  return (entity) => {
    if (updates) {
      const originData = JSON.parse(JSON.stringify(entity));
      let data = updates;
      if (updates.sections) {
        const oldSections = JSON.parse(JSON.stringify(entity.sections));
        const newSections = JSON.parse(JSON.stringify(updates.sections));
        const { newKey, originalKey } = getDiffSection(oldSections, newSections);
        if (newKey !== originalKey) {
          entity.propertyFields = setNewKey(entity.propertyFields, newKey, originalKey);
        }
      }
      if (updates.propertyFields) {
        removeImageUploaded(originData.propertyFields, updates.propertyFields);
        data = uploadImageProperties(updates, entity.clientId, entity.type);
      }
      _.assign(entity, data);
    }
    return entity.saveAsync();
  };
}

function getAppear(appearArray) {
  return appearArray.map((item) => item.categoryId);
}

function checkOffForAttribute(oldData, req, collection, entity) {
  const diff = _.difference(oldData, req.body.appear);
  collection.find({
    attributeId: entity.group_id
  }, { categoryId: 1, _id: 0 })
    .then((result) => {
      if (result.length > 0) {
        const deletedAppear = _.difference(getAppear(result), diff);
        if (deletedAppear.length > 0) {
          collection.deleteMany({ attributeId: entity.group_id })
            .then(() => {
              insertAppear(collection, entity.group_id, deletedAppear);
            });
        } else {
          collection.deleteMany({ attributeId: entity.group_id })
            .then(() => {});
        }
      }
    });
}

function updateChildAttributesAppear(req, entity, collection, oldData) {
  req.attributes.find({ group_id: entity._id })
    .then((results) => {
      results.forEach((resItem) => {
        collection.find({
          attributeId: resItem._id
        }, { categoryId: 1, _id: 0 })
          .then((result) => {
            const newAppear = _.union(req.body.appear,
              _.difference(getAppear(result), oldData));
            collection.deleteMany({ attributeId: resItem._id })
              .then(() => {
                insertAppear(collection, resItem._id, newAppear);
              });
          });
      });
    });
}

function updateAttributesAppear(req, res, result, collection, entity, returnValue) {
  if (req.body.appear) {
    if (result.length <= 0) {
      insertAppear(collection, entity._id, req.body.appear);
      entity.saveAsync()
        .then(() => {
          returnValue.appear = req.body.appear;
          res.status(201).json(returnValue);
        });
    } else {
      collection.deleteMany({ attributeId: entity._id })
        .then(() => {
          insertAppear(collection, entity._id, req.body.appear);
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
      collectionAppear.find({ attributeId: entity._id }, { categoryId: 1, _id: 0 })
        .then((result) => {
          const old = getAppear(result);
          if (!req.body.checked && entity.group_id !== null) {
            checkOffForAttribute(old, req, collectionAppear, entity);
          }
          updateChildAttributesAppear(req, entity, collectionAppear, old);
        });
    }

    /** *** Update the Attributes and Appears Collection***** */
    const originData = JSON.parse(JSON.stringify(entity));
    let data = req.body;
    if (req.body.properties) {
      data = prepareImageProperties(originData, req.body, req.client._id, 'attributes');
    }
    _.assign(entity, data);
    const returnValue = JSON.parse(JSON.stringify(entity));

    collectionAppear.find({ attributeId: entity._id })
      .then((result) => {
        updateAttributesAppear(req, res, result, collectionAppear, entity, returnValue);
      });
  };
}

function uploadAppear(data, client) {
  const collectionAppear = AppearCollection(`${client}_appears`);
  data.forEach((dataItem) => {
    if (dataItem.appear) {
      insertAppear(collectionAppear, dataItem._id, dataItem.appear);
    }
  });
}
function removeCategoryEntity(req, res) {
  const collectionAppear = AppearCollection(`${req.client.code}_appears`);
  return (entity) => {
    if (entity) {
      collectionAppear.find({ categoryId: entity._id })
        .then((result) => {
          if (result.length > 0) {
            collectionAppear.deleteMany({ categoryId: entity._id })
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
  req.category.find({ parent_id: id })
    .then((result) => {
      if (result.length > 0) {
        req.category
          .deleteMany({ parent_id: id }, (err, result) => {
            if (!result) {
              console.log(err);
            }
          });
        result.forEach((item) => {
          collectionAppear.find({ categoryId: item._id })
            .then((result) => {
              if (result.length > 0) {
                collectionAppear.deleteMany({ categoryId: item._id })
                  .then(() => {});
              }
            });
          removeChildren(req, item._id);
        });
      }
    });
}

function removeAttribute(req, id) {
  req.attributes.find({ group_id: id })
    .then((result) => {
      req.attributes
        .deleteMany({ group_id: id }, (err, result) => {
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
          .deleteOne({ group_id: id }, (err, result) => {
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

function saveUpdates(collection, updates) {
  return (entity) => {
    if (updates) {
      const updateCode = (entity.code !== updates.code);
      if (updateCode) {
        const collection = ['attributes', 'histories', 'natives', 'products', 'virtuals', 'appears'];
        collection.forEach((item) => {
          if (db.collection(`${entity.code}_${item}`)) {
            db.collection(`${entity.code}_${item}`).rename(`${updates.code}_${item}`);
          }
        });
      }
      _.assign(entity, updates);
      return entity.saveAsync();
    }
  };
}

function removeEntity(res) {
  return (entity) => {
    if (entity) {
      const collection = ['attributes', 'histories', 'natives', 'products', 'virtuals', 'appears'];
      collection.forEach((item) => {
        if (db.collection(`${entity.code}_${item}`)) {
          db.collection(`${entity.code}_${item}`).drop(() => {});
        }
      });
      entity.removeAsync()
        .then(respondWith(res, 204));
    }
  };
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
  saveCategoriesUpdates,
  saveAttributeUpdates,
  handleCreate,
  handleAttributeCreate,
  handleAttributeFetch,
  removeEntity,
  removeCategoryEntity,
  removeDeletedProperty,
  createCollection,
  handleExistingRemove,
  uploadAppear,
  setAppearForCategory,
};
