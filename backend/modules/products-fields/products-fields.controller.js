const ProductsField = require('./products-fields.model');

const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  respondWith,
  handleExistingRemove,
} = require('../../utils');

// Gets a single Category from the DB
exports.show = (req, res) => {
  ProductsField
    .find({ clientId: req.params.clientId })
    .execAsync()
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Updates an existing Category in the DB
exports.update = (req, res) => {
  ProductsField
    .find({ clientId: req.params.clientId })
    .then(handleExistingRemove(ProductsField, req, res))
    .catch(handleError(res));
};

// Update an existing ImageKey in the DB
exports.updateImageKey = (req, res) => {
  ProductsField
    .find({ clientId: req.params.clientId })
    .then(handleExistingRemove(ProductsField, req, res))
    .catch(handleError(res));
};

// Deletes a Category from the DB
exports.remove = (req, res) => {
  ProductsField
    .deleteMany({ clientId: req.params.clientId }, (err) => {
      if (err) {
        handleError(res);
      } else {
        respondWith(res, 204);
      }
    })
    .then(respondWith(res, 204));
};
