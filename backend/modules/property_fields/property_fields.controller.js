const PropertyFields = require('./property_fields.model');

const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  saveUpdates,
  createProperty,
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
    .createAsync(req.body.propertyField)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Gets a single Category from the DB
exports.show = (req, res) => {
  console.log( "params>>>", req.params);//fixme
  console.log( "param1>>>", req.params.clientId);//fixme
  console.log( "param2>>>", req.params.type);//fixme
  PropertyFields
    .find({clientId:req.params.clientId, type: req.params.type})
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
