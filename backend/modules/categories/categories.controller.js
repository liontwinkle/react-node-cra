const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  saveUpdates,
  handleCreate,
  removeCategoryEntity,
  removeChildren
} = require('../../utils');

// Gets a list of Categories
exports.index = (req, res) => {
  req.category
    .find()
    .select('-__v')
    .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Category in the DB
exports.create = (req, res) => {
  req.category
    .find()
    .then(handleCreate(req))
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Gets a single Category from the DB
exports.show = (req, res) => {
  req.category
    .findById(req.params.categoryId)
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

  req.category
    .findByIdAsync(req.params.categoryId)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Update a Category all default
exports.updateDefault = (req, res) => {
  req.category.updateMany({}, { $set: { defaultProperties: req.body } }, (err, result) => {
    if (!err) {
      res.status(200)
        .json(result);
    } else {
      handleError(res);
    }
  });
};
// Deletes a Category from the DB
exports.remove = (req, res) => {
  req.category
    .findByIdAsync(req.params.categoryId)
    .then(handleEntityNotFound(res))
    .then(removeCategoryEntity(req, res))
    .then(removeChildren(req, req.params.categoryId))
    .catch(handleError(res));
};
