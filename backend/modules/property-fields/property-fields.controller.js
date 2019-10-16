const PropertyFields = require('./property-fields.model');

const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  saveUpdates,
  respondWith,
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
    .insertMany(req.body.propertyField, (err, result) => {
      if (err) {
        handleError(res);
      } else {
        res.status(201).json(result);
      }
    });
};

// Gets a single Category from the DB
exports.show = (req, res) => {
  PropertyFields
    .find({ clientId: req.params.clientId, type: req.params.type })
    .execAsync()
    .then(handleEntityNotFound(res))
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
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Category from the DB
exports.remove = (req, res) => {
  PropertyFields
    .deleteMany({ clientId: req.params.clientId }, (err) => {
      if (err) {
        handleError(res);
      } else {
        respondWith(res, 204);
      }
    })
    .then(respondWith(res, 204));
};
