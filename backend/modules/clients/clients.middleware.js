const Clients = require('./clients.model');
const CategoryModel = require('../categories/categories.model');
const ProductsModel = require('../products/products.model');
const AttributesModel = require('../attributes/attributes.model');

const { handleEntityNotFound, handleError } = require('../../utils');

exports.loadClient = (req, res, next, id) => Clients
  .findById(id)
  .exec()
  .then((client) => {
    if (client) {
      req.client = client;
      return next();
    }

    return handleEntityNotFound(res);
  })
  .catch(handleError(res));

exports.loadCategory = (req, res, next, type) => {
  if (req.client) {
    if (type === 'products') {
      req.products = ProductsModel(`${req.client.code}_${type}`);
    } else if (type === 'attributes') {
      req.attributes = AttributesModel(`${req.client.code}_${type}`);
    } else {
      req.category = CategoryModel(`${req.client.code}_${type}`);
    }
    return next();
  }

  return Clients
    .findById(req.params.id)
    .exec()
    .then((client) => {
      if (client) {
        req.category = CategoryModel(`${client.code}_${type}`);
        return next();
      }

      return handleEntityNotFound(res);
    })
    .catch(handleError(res));
};
