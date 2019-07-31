const Clients = require('./clients.model');
const CategoryModel = require('../categories/categories.model');

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
    req.category = CategoryModel(req.client.code + '_' + type);
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
