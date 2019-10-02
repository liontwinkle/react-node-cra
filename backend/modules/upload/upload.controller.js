const CategoryModel = require('../categories/categories.model');
const ProductsModel = require('../products/products.model');
const AttributesModel = require('../attributes/attributes.model');

const checkType = {
  virtual: ['newRules', 'properties'],
  native: ['newRules', 'properties'],
  products: [],
  attributes: ['rules', 'properties'],
};

const checkDuplicateData = (currentData, newData, type) => {
  const newCreateData = [];
  newData.forEach((newItem) => {
    if (currentData.findIndex((currentItem) => {
      let matchFlag = true;
      checkType[type].forEach((checkItem) => {
        if (currentItem[checkItem] !== newItem[checkItem]) {
          matchFlag = false;
        }
      });
      return matchFlag;
    }) === -1) {
      newCreateData.push(newItem);
    }
  });
  return newCreateData;
};
exports.upload = (req) => {
  console.log('######## DEBUG UPLOAD ###########');
  console.log('### DEBUG TYPE: ', req.params.type);
  console.log('### DEBUG CLIENT ', req.params.clientId);
  let collection = null;
  if (req.params.type === 'virtual' || req.params.type === 'native') {
    collection = CategoryModel(`${req.params.clientId}_${req.params.type}`);
  } else if (req.params.type === 'products') {
    collection = ProductsModel(`${req.params.clientId}_${req.params.type}`);
  } else {
    collection = AttributesModel(`${req.params.clientId}_${req.params.type}`);
  }

  collection.find({}, (err, result) => {
    console.log('### DEBUG RES: ', checkDuplicateData(result, req.body, req.params.type));
  });
};
