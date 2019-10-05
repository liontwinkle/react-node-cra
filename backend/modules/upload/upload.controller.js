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
/*
const checkDuplicateSection = (currentSection, newSection) => {
  console.log('#### DEBUG CURRENT SECTIONS ####'); // fixme
  console.log('#### DEBUG NEW SECTIONS: ', newSection); // fixme
  const compareUpdateSection = [];
  currentSection.forEach((currentItem) => {
    compareUpdateSection.push({
      label: currentItem.label,
      key: currentItem.key,
      order: currentItem.order,
    });
  });
  console.log('#### DEBUG COMPARE CURRENT SECTION: ', compareUpdateSection); // fixme
  newSection.forEach((newItem) => {
    if (currentSection.findIndex(item => (item.key === newItem.key)) === -1) {
      compareUpdateSection.push({
        label: newItem.label,
        key: newItem.key,
        order: parseInt(newItem.order.$numberInt, 10) || newItem.order,
      });
    }
  });
  console.log('#### DEBUG COMPARE NEW SECTION: ', compareUpdateSection); // fixme
  return compareUpdateSection;
};

const checkDuplicateProperties = (currentPropertyFields, newPropertyFields) => {

};
*/
exports.keyUpload = (req, /* res */) => {
  PropertyFields.find({
    clientId: req.params.clientId,
    type: req.params.type
  }, (err, result) => {
    if (!err) {
      console.log('#### DEBUG RESULT: ', result); // fixme
      // const { sections } = result[0];
      // const UpdateSections = checkDuplicateSection(sections, req.body[0].sections);
      // const { propertyFields } = result[0];
      // const UpdatePropertyFields =
      // checkDuplicateProperties(propertyFields, req.body[0].propertyFields);
    }
  });
};
