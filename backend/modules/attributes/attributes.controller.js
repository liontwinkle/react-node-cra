const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  saveAttributeUpdates,
  handleCreate,
  removeEntity,
  removeAttribute
} = require('../../utils');

// Gets a list of Categories
exports.index = (req, res) => {
  req.attributes
    .find()
    .select('-__v')
    .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Category in the DB
exports.create = (req, res) => {
  req.attributes
    .find()
    .then(handleCreate(req.attributes, 'attribute', req.body))
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Gets a single Category from the DB
exports.show = (req, res) => {
  req.attributes
    .findById(req.params.attributeId)
    .select('-__v')
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

  req.attributes
    .findByIdAsync(req.params.attributeId)
    .then(handleEntityNotFound(res))
    .then(saveAttributeUpdates(req))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Category from the DB
exports.remove = (req, res) => {
  req.attributes
    .findByIdAsync(req.params.attributeId)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .then(removeAttribute(req, req.params.attributeId))
    .catch(handleError(res));
};
