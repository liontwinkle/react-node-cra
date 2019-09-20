const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  saveUpdates,
  removeEntity,
  removeChildren
} = require('../../utils');

// Gets a list of Categories
exports.index = (req, res) => {
  req.history
    .find({ type: req.params.itemType })
    .select('-__v')
    .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Category in the DB
exports.create = (req, res) => {
  req.history
    .createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Gets a single Category from the DB
exports.show = (req, res) => {
  req.history
    .findById(req.params.historyId)
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

  req.history
    .findByIdAsync(req.params.historyId)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Category from the DB
exports.remove = (req, res) => {
  req.history
    .findByIdAsync(req.params.historyId)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .then(removeChildren(req, req.params.historyId))
    .catch(handleError(res));
};
