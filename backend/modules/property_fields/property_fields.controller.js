const PropertyFields = require('./property_fields.model');

const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  saveUpdates,
  removeEntity,
} = require('../../utils');

// Gets a list of Categories
exports.index = (req, res) => {
  PropertyFields
    .find()
    .select('-__v')
    .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Category in the DB
exports.create = (req, res) => {
  PropertyFields
    .createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Gets a single Category from the DB
exports.show = (req, res) => {
  PropertyFields
    .findById(req.params.id)
    // .select('id name code url createdAt')
    .execAsync()
    .then(handleEntityNotFound(res, req))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Updates an existing Category in the DB
exports.update = (req, res) => {
  if (req.body._id) {
    delete req.body._id;
  }

  PropertyFields
    .findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res, req))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Category from the DB
exports.remove = (req, res) => {
  PropertyFields
    .findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res, req))
    .then(removeEntity(res))
    .catch(handleError(res));
};
