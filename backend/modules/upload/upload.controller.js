const {
  handleError,
  uploadAppear,
  setAppearForCategory,
} = require('../../utils');

const CategoryModel = require('../categories/categories.model');
const ProductsModel = require('../products/products.model');
const AttributesModel = require('../attributes/attributes.model');
const PropertyFieldsCollection = require('../property-fields/property-fields.model');

/**
 * Section to save the sections and fields
 * By Igor
 */

const checkDuplicateSection = (currentSection, newSection) => {
  const compareUpdateSection = [];
  let maxOrder = 0;
  currentSection.forEach((currentItem) => {
    if (maxOrder < currentItem.order) {
      maxOrder = currentItem.order;
    }
    compareUpdateSection.push({
      label: currentItem.label,
      key: currentItem.key,
      order: currentItem.order,
    });
  });
  maxOrder++;
  newSection.forEach((newItem, index) => {
    if (currentSection.findIndex((item) => (item.key === newItem.key)) === -1) {
      compareUpdateSection.push({
        label: newItem.label,
        key: newItem.key,
        order: (maxOrder + index),
      });
    }
  });
  return compareUpdateSection;
};

const checkDuplicateProperties = (currentPropertyFields, newPropertyFields) => {
  const updatePropertyFields = [];
  let maxOrder = 0;
  currentPropertyFields.forEach((currentItem) => {
    if (maxOrder < currentItem.order) {
      maxOrder = currentItem.order;
    }
    updatePropertyFields.push({
      items: currentItem.items,
      key: currentItem.key,
      label: currentItem.label,
      default: currentItem.default,
      template: currentItem.template,
      propertyType: currentItem.propertyType,
      section: currentItem.section,
      order: currentItem.order,
    });
  });
  maxOrder++;
  newPropertyFields.forEach((newItem, index) => {
    if (currentPropertyFields.findIndex((item) => (item.key === newItem.key)) === -1) {
      updatePropertyFields.push({
        items: newItem.items,
        key: newItem.key,
        label: newItem.label,
        propertyType: newItem.propertyType,
        section: newItem.section,
        order: (maxOrder + index)
      });
    }
  });
  return updatePropertyFields;
};
const keyUpload = (clientId, type, data) => {
  let updateSections = [];
  let updatePropertyFields = [];
  PropertyFieldsCollection.find({
    clientId,
    type
  }, (err, result) => {
    if (!err) {
      if (result) {
        const { sections } = result[0];
        updateSections = checkDuplicateSection(sections, data.sections);
        const { propertyFields } = result[0];
        updatePropertyFields = checkDuplicateProperties(propertyFields, data.propertyFields);
        PropertyFieldsCollection.updateMany({ clientId, type },
          {
            $set: {
              propertyFields: updatePropertyFields,
              sections: updateSections
            }
          }, (err) => {
            if (err) {
              console.log(err);
            }
          });
      }
    }
  });
};

/** Section to save the properties
 *  By Igor
 *  ** */

const checkType = {
  virtual: 'categoryId',
  native: 'categoryId',
  products: '_id',
  attributes: 'attributeId',
};

const removeList = ['createdAt', 'updatedAt', '__v', '$oid'];

const removeUnnecessaryData = (data) => {
  const addData = {};
  const keys = Object.keys(data);
  keys.forEach((keyItem) => {
    if (removeList.findIndex((removeItem) => (removeItem === keyItem)) === -1) {
      if (data[keyItem] && !Array.isArray(data[keyItem]) && typeof data[keyItem] === 'object' && keyItem !== 'properties') {
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

// const mergeTwoProperties = (currentProperties, recvProperties) => {
//
// };

// const makeNewData = (newItem, currentData) => {
//   const newItemKeys = Object.keys(newItem);
//   const newCurrentKeys = Object.keys(currentData);
//   const updateData = {};
//   newCurrentKeys.forEach((currentKeyItem) => {
//     if (newItem[currentKeyItem]) {
//       if (currentKeyItem === 'rules') {
//         const newRules = _.merge(currentData.rules, newItem.rules);
//         currentData.rules = newRules;
//       } else if (currentKeyItem === 'properties') {
//         mergeTwoProperties(currentData.properties, newItem.properties);
//       }
//     }
//   });
// };

const checkDuplicateData = (currentData, newData, type) => {
  const newCreateData = [];
  let duplicateFlag = false;
  newData.forEach((newItem) => {
    newCreateData.push(removeUnnecessaryData(newItem));
    if (type !== 'products') {
      const duplicateFilter = currentData.find((currentItem) =>
        (currentItem[checkType[type]] === newItem[checkType[type]]));
      if (duplicateFilter) {
        console.log('### DEBUG CURRENT DATA: ', duplicateFilter); // fixme
        duplicateFlag = true;
      }
    } else {
      newCreateData.push(removeUnnecessaryData(newItem));
    }
  });

  return {
    updateData: newCreateData,
    duplicateFlag,
  };
};

const getKeysfromNewData = (data) => {
  const keys = Object.keys(data);
  const sections = [];
  keys.forEach((keyItem) => {
    if (!Array.isArray(data[keyItem]) && data[keyItem] !== null && typeof data[keyItem] === 'object') {
      sections.push({
        key: keyItem,
        label: keyItem.toUpperCase(),
      });
    }
  });
  console.log('####DHERE: ');
  return sections;
};

const convertCommonProeprties = (section, key, value) => {
  let propertyType = 'string';
  if (value === null || Array.isArray(value)) {
    propertyType = 'array';
  } else if (typeof value !== 'object') {
    const regex = /(\/[a-z0-9\-_].*)/g;
    if (typeof value === 'boolean') {
      propertyType = 'toggle';
    } else if (regex.test(value)) {
      propertyType = 'urlpath';
    }
  }
  return {
    key,
    section,
    label: key.toUpperCase(),
    propertyType,
  };
};
const getPropertiesfromNewData = (data) => {
  const keys = Object.keys(data);
  const properties = [];
  keys.forEach((keyItem) => {
    if (data[keyItem] !== null && !Array.isArray(data[keyItem]) && typeof data[keyItem] === 'object') {
      const subKeys = Object.keys(data[keyItem]);
      subKeys.forEach((subKeyItem) => {
        properties.push(convertCommonProeprties(keyItem, subKeyItem, data[keyItem][subKeyItem]));
      });
    } else {
      properties.push(convertCommonProeprties(null, keyItem, data[keyItem]));
    }
  });
  return properties;
};

const getNewFieldData = (updateData) => {
  let recvProperties = {};
  updateData.forEach((dataItem) => {
    const newProperties = dataItem.properties || {};
    recvProperties = { ...recvProperties, ...newProperties };
  });
  const sections = getKeysfromNewData(recvProperties);
  const properties = getPropertiesfromNewData(recvProperties);
  return {
    sections,
    propertyFields: properties,
  };
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
      const { updateData, duplicateFlag } = checkDuplicateData(result, req.body, req.params.type);
      console.log('#### UPLOAD DATA: ', updateData); // fixme
      if (updateData.length > 0) {
        try {
          if (req.params.type === 'attributes') {
            uploadAppear(updateData, req.params.clientId);
          } else if (req.params.type === 'virtual') {
            setAppearForCategory(updateData, req.params.clientId);
          }
          const fieldData = getNewFieldData(updateData);
          keyUpload(req.params.id, req.params.type, fieldData);
          if (duplicateFlag) {
            collection.deleteMany({ categoryId: updateData.categoryId })
              .then(() => {
                collection.insertMany(updateData).then(() => {
                  res.status(201).json(updateData[0]);
                });
              });
          } else {
            collection.insertMany(updateData)
              .then(() => {
                res.status(201)
                  .json(updateData[0]);
              });
          }
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
