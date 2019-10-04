const {
  handleError,
} = require('../../utils');

const CategoryModel = require('../categories/categories.model');
const ProductsModel = require('../products/products.model');
const AttributesModel = require('../attributes/attributes.model');
const PropertyFields = require('../property-fields/property-fields.model');

const checkType = {
  virtual: ['newRules', 'properties', 'name'],
  native: ['newRules', 'properties', 'name'],
  products: [],
  attributes: ['rules', 'properties', 'name'],
};

const removeList = ['createdAt', 'updatedAt', '__v', '_id'];

const removeUnnecessaryData = (data) => {
  const addData = {};
  const keys = Object.keys(data);
  keys.forEach((keyItem) => {
    if (removeList.findIndex(removeItem => (removeItem === keyItem)) === -1) {
      addData[keyItem] = data[keyItem];
    }
  });
  return addData;
};
const checkDuplicateData = (currentData, newData, type) => {
  const newCreateData = [];
  newData.forEach((newItem) => {
    let matchFlag = false;
    currentData.forEach((currentItem) => {
      checkType[type].forEach((checkItem) => {
        if (currentItem[checkItem] === newItem[checkItem]) {
          matchFlag = true;
        }
      });
    });
    if (!matchFlag) {
      newCreateData.push(removeUnnecessaryData(newItem));
    }
  });
  return newCreateData;
};
exports.upload = (req, res) => {
  let collection = null;
  if (req.params.type === 'virtual' || req.params.type === 'native') {
    collection = CategoryModel(`${req.params.clientId}_${req.params.type}`);
  } else if (req.params.type === 'products') {
    collection = ProductsModel(`${req.params.clientId}_${req.params.type}`);
  } else {
    collection = AttributesModel(`${req.params.clientId}_${req.params.type}`);
  }

  collection.find({}, (err, result) => {
    if (!err) {
      const updateData = checkDuplicateData(result, req.body, req.params.type);
      if (updateData.length > 0) {
        try {
          collection.insertMany(updateData);
          res.status(201).json(updateData);
        } catch (e) {
          handleError(res);
        }
      } else {
        res.status(201).json([]);
      }
    } else {
      handleError(res);
    }
  });
};

exports.keyUpload = (req, /* res */) => {
  PropertyFields.find({
    clientId: req.params.clientId,
    type: req.params.type
  }, (err, result) => {
    if (!err) {
      console.log('#### DEBUG RESULT: ', result); // fixme
      // const sections = result.sections;

      // const propertyFields = result.propertyFields;
    }
  });
};
