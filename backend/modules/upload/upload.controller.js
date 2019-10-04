const {
  handleError,
} = require('../../utils');

const CategoryModel = require('../categories/categories.model');
const ProductsModel = require('../products/products.model');
const AttributesModel = require('../attributes/attributes.model');

const checkType = {
  virtual: ['newRules', 'properties', 'name'],
  native: ['newRules', 'properties', 'name'],
  products: [],
  attributes: ['rules', 'properties', 'name'],
};

const checkDuplicateData = (currentData, newData, type) => {
  const newCreateData = [];
  newData.forEach((newItem) => {
    let matchFlag = false;
    currentData.forEach((currentItem) => {
      checkType[type].forEach((checkItem) => {
        if (currentItem[checkItem] === newItem[checkItem]) {
          console.log('### DEBUG MATCHING TEST: ', currentItem[checkItem], newItem[checkItem]);
          matchFlag = true;
        }
      });
      console.log('### DEBUG MATCHING RESULT: ', matchFlag);
    });
    if (!matchFlag) {
      newCreateData.push(newItem);
    }
  });
  return newCreateData;
};
exports.upload = (req, res) => {
  console.log('######## DEBUG UPLOAD ###########'); // fixme
  console.log('### DEBUG TYPE: ', req.params.type); // fixme
  console.log('### DEBUG CLIENT ', req.params.clientId); // fixme
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
      console.log('### DEBUG UPDATE DATA: ', updateData); // fixme
      if (updateData.length > 0) {
        console.log('### DEBUG START CREATE ###'); // fixme
        try {
          collection.insertMany(updateData);
          console.log('### DEBUG SUCCESS RESPONSE ###'); // fixme
          res.status(201).json(updateData);
        } catch (e) {
          console.log('### DEBUG ERROR RESPONSE ###'); // fixme
          handleError(res);
        }
      } else {
        console.log('### DEBUG NONE RESPONSE ###'); // fixme
        res.status(201).json([]);
      }
    } else {
      console.log('### DEBUG ERROR RESPONSE ###'); // fixme
      handleError(res);
    }
  });
};
