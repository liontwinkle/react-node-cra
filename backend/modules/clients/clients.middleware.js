const Clients = require('./clients.model');
const CategoryModel = require('../categories/categories.model');
const ProductsModel = require('../products/products.model');
const {
  handleEntityNotFound,
  handleError
} = require('../../utils');

exports.loadClient = (req, res, next, id) => {
  return Clients
    .findById(id)
    .exec()
    .then((client) => {
      if (client) {
        req.client = client;
        return next();
      }

      return handleEntityNotFound(res, req);
    })
    .catch(handleError(res));
};

exports.loadCategory = (req, res, next, type) => {
  if (req.client) {
    if( type !== 'products')
      req.category = CategoryModel(req.client.code + '_' + type);
    else{
      req.products = ProductsModel(req.client.code + '_' + type);
    }
    return next();
  }

  return Clients
    .findById(req.params.id)
    .exec()
    .then((client) => {
      if (client) {
        req.category = CategoryModel(client.code + '_' + type);
        return next();
      }

      return handleEntityNotFound(res, req);
    })
    .catch(handleError(res));
};
