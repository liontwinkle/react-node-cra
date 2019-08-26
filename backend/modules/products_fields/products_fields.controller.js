const ProductsField = require('./products_fields.model');

const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  saveUpdates,
  respondWith,
  removeEntity,
  handleExistingRemove,
} = require('../../utils');

// Gets a single Category from the DB
exports.show = (req, res) => {
  ProductsField
    .find({clientId:req.params.clientId})
    .execAsync()
    .then(handleEntityNotFound(res, req))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Updates an existing Category in the DB
exports.update = (req, res) => {
  let newData = {
    clientId: req.params.clientId,
    fields: req.body,
  };
  ProductsField
    .find({clientId:req.params.clientId})
    .then(handleExistingRemove(ProductsField,req, newData))
    .then(responseWithResult(res))
    .catch(handleError(res))
};

// Deletes a Category from the DB
exports.remove = (req, res) => {
  ProductsField
    .deleteMany({clientId:req.params.clientId}, function (err, result) {
      if( err ){
        handleError(res);
      }
      else{
        respondWith(res, 204);
      }
    })
    .then(respondWith(res,204))
};
