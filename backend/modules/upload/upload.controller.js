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
    if (currentSection.findIndex(item => (item.key === newItem.key)) === -1) {
      compareUpdateSection.push({
        label: newItem.label,
        key: newItem.key,
        order: (maxOrder + index),
      });
    }
  });
  return compareUpdateSection;
};

// const checkDuplicateProperties = (currentPropertyFields, newPropertyFields) => {
//   const updatePropertyFields = [];
//   currentPropertyFields.forEach((currentItem) => {
//     updatePropertyFields.push({
//       items: currentItem.items,
//       key: currentItem.key,
//       label: currentItem.label,
//       default: currentItem.default,
//       propertyType: currentItem.propertyType,
//       section: currentItem.section,
//     });
//   });
//
//   newPropertyFields.forEach((newItem) => {
//     if (currentPropertyFields.findIndex(item => (item.key === newItem.key)) === -1) {
//       updatePropertyFields.push({
//         items: newItem.items,
//         key: newItem.key,
//         label: newItem.label,
//         default: newItem.default,
//         propertyType: newItem.propertyType,
//         section: newItem.section,
//       });
//     }
//   });
//   return updatePropertyFields;
// };
const keyUpload = (clientId, type, data) => {
  let UpdateSections = [];
  // let UpdatePropertyFields = [];
  PropertyFieldsCollection.find({
    clientId,
    type
  }, (err, result) => {
    if (!err) {
      if (result) {
        const { sections } = result[0];
        UpdateSections = checkDuplicateSection(sections, data.sections);
        console.log('##### DEBUG UPDATED SECTION: ', UpdateSections); // fixme
        // const { propertyFields } = result[0];
        // const newPropertyFields = data.propertyFields;
        // UpdatePropertyFields = checkDuplicateProperties(propertyFields, newPropertyFields);
        // PropertyFieldsCollection.deleteMany({
        //   clientId: req.params.clientId,
        //   type: req.params.type
        // }, (err) => {
        //   if (!err) {
        //     PropertyFieldsCollection.insertMany({
        //       clientId: req.params.clientId,
        //       type: req.params.type,
        //       sections: UpdateSections,
        //       propertyFields: UpdatePropertyFields,
        //     }, (err) => {
        //       if (!err) {
        //         res.status(201).json([]);
        //       }
        //     });
        //   }
        // });
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
    if (removeList.findIndex(removeItem => (removeItem === keyItem)) === -1) {
      if (data[keyItem] && !Array.isArray(data[keyItem]) && typeof data[keyItem] === 'object' && keyItem !== 'properties') {
        console.log('#### DEBUG DETAIL: ', data[keyItem]);
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
    if (type !== 'products') {
      const duplicateFilter = currentData.find(currentItem =>
        (currentItem[checkType[type]] === newItem[checkType[type]]));
      if (!duplicateFilter) {
        try {
          newCreateData.push(removeUnnecessaryData(newItem));
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      newCreateData.push(removeUnnecessaryData(newItem));
    }
  });

  return newCreateData;
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
  return sections;
};

const converCommonProeprties = (key, value) => {
  if (value === null || Array.isArray(value)) {
    return {
      key,
      label: key.toUpperCase(),
      propertyType: 'array'
    };
  } if (typeof value !== 'object') {
    const regex = /(\/[a-z0-9\-_].*)/g;
    if (regex.test(value)) {
      return {
        key,
        label: key.toUpperCase(),
        propertyType: 'urlpath'
      };
    }
    return {
      key,
      label: key.toUpperCase(),
      propertyType: 'string'
    };
  }
};
const getPropertiesfromNewData = (data) => {
  const keys = Object.keys(data);
  const properties = [];
  keys.forEach((keyItem) => {
    if (data[keyItem] !== null && !Array.isArray(data[keyItem]) && typeof data[keyItem] === 'object') {
      const subKeys = Object.keys(data[keyItem]);
      subKeys.forEach((subKeyItem) => {
        properties.push(converCommonProeprties(subKeyItem, data[keyItem][subKeyItem]));
      });
    } else {
      properties.push(converCommonProeprties(keyItem, data[keyItem]));
    }
  });
  return properties;
};

const getNewFieldData = (updateData) => {
  let recvProperties = {};
  updateData.forEach((dataItem) => {
    const newProperties = dataItem.properties || {};
    recvProperties = Object.assign({}, recvProperties, newProperties);
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
      const updateData = checkDuplicateData(result, req.body, req.params.type);
      if (updateData.length > 0) {
        try {
          if (req.params.type === 'attributes') {
            uploadAppear(updateData, req.params.clientId);
          } else if (req.params.type === 'virtual') {
            setAppearForCategory(updateData, req.params.clientId);
          }
          const fieldData = getNewFieldData(updateData);
          keyUpload(req.params.id, req.params.type, fieldData);
          // collection.insertMany(updateData);
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
