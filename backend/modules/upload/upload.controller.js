const {
  handleError,
} = require('../../utils');

const CategoryModel = require('../categories/categories.model');
const ProductsModel = require('../products/products.model');
const AttributesModel = require('../attributes/attributes.model');
const PropertyFieldsCollection = require('../property-fields/property-fields.model');

const checkType = {
  virtual: 'categoryId',
  native: 'categoryId',
  products: [],
  attributes: 'attributeId',
};

const checkDuplicateData = (currentData, newData, type) => {
  const newCreateData = [];
  newData.forEach((newItem) => {
    const duplicateFilter = currentData.find(currentItem =>
      (currentItem[checkType[type]] === newItem[checkType[type]]));
    if (!duplicateFilter) {
      try {
        newCreateData.push(newItem);
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
      items: currentItem.items,
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
