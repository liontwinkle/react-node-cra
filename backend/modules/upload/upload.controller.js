const {
  handleError,
} = require('../../utils');

const CategoryModel = require('../categories/categories.model');
const ProductsModel = require('../products/products.model');
const AttributesModel = require('../attributes/attributes.model');
const PropertyFieldsCollection = require('../property-fields/property-fields.model');

const checkType = {
  virtual: ['newRules', 'properties', 'name'],
  native: ['newRules', 'properties', 'name'],
  products: [],
  attributes: ['rules', 'properties', 'name'],
};

const removeList = ['createdAt', 'updatedAt', '__v', '_id', '$oid'];

const removeUnnecessaryData = (data) => {
  const addData = {};
  const keys = Object.keys(data);
  keys.forEach((keyItem) => {
    if (removeList.findIndex(removeItem => (removeItem === keyItem)) === -1) {
      if (data[keyItem] && typeof data[keyItem] === 'object') {
        const key = Object.keys(data[keyItem]);
        if (key.length > 0) {
          if (key[0].indexOf('$') > 0) {
            addData[keyItem] = data[keyItem][key[0]];
          }
        } else {
          addData[keyItem] = data[keyItem];
        }
      } else {
        addData[keyItem] = data[keyItem];
      }
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
      try {
        newCreateData.push(removeUnnecessaryData(newItem));
      } catch (e) {
        console.error(e);
      }
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
          res.status(201).json(updateData[0]);
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

const checkDuplicateSection = (currentSection, newSection) => {
  const compareUpdateSection = [];
  currentSection.forEach((currentItem) => {
    compareUpdateSection.push({
      label: currentItem.label,
      key: currentItem.key,
      order: currentItem.order,
    });
  });
  newSection.forEach((newItem) => {
    if (currentSection.findIndex(item => (item.key === newItem.key)) === -1) {
      compareUpdateSection.push({
        label: newItem.label,
        key: newItem.key,
        order: parseInt(newItem.order.$numberInt, 10) || newItem.order,
      });
    }
  });
  return compareUpdateSection;
};

const checkDuplicateProperties = (currentPropertyFields, newPropertyFields) => {
  const updatePropertyFields = [];
  currentPropertyFields.forEach((currentItem) => {
    updatePropertyFields.push({
      items: currentItem.items.map(item => (removeUnnecessaryData(item))),
      key: currentItem.key,
      label: currentItem.label,
      default: currentItem.default,
      propertyType: currentItem.propertyType,
      section: currentItem.section,
    });
  });

  newPropertyFields.forEach((newItem) => {
    if (currentPropertyFields.findIndex(item => (item.key === newItem.key)) === -1) {
      updatePropertyFields.push({
        items: newItem.items,
        key: newItem.key,
        label: newItem.label,
        default: newItem.default,
        propertyType: newItem.propertyType,
        section: newItem.section,
      });
    }
  });
  return updatePropertyFields;
};
exports.keyUpload = (req, res) => {
  let UpdateSections = [];
  let UpdatePropertyFields = [];
  PropertyFieldsCollection.find({
    clientId: req.params.clientId,
    type: req.params.type
  }, (err, result) => {
    if (!err) {
      if (result) {
        const { sections } = result[0];
        UpdateSections = checkDuplicateSection(sections, req.body[0].sections);
        const { propertyFields } = result[0];
        const newPropertyFields = req.body[0].propertyFields;
        UpdatePropertyFields = checkDuplicateProperties(propertyFields, newPropertyFields);
        PropertyFieldsCollection.deleteMany({
          clientId: req.params.clientId,
          type: req.params.type
        }, (err) => {
          if (!err) {
            PropertyFieldsCollection.insertMany({
              clientId: req.params.clientId,
              type: req.params.type,
              sections: UpdateSections,
              propertyFields: UpdatePropertyFields,
            }, (err) => {
              if (!err) {
                res.status(201).json([]);
              }
            });
          }
        });
      }
    }
  });
};
