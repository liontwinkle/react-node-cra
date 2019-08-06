const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  saveUpdates,
  removeEntity
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
    .createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Gets a single Category from the DB
exports.show = (req, res) => {
  req.category
    .findById(req.params.categoryId)
    .select('-__v')
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

  req.category
    .findByIdAsync(req.params.categoryId)
    .then(handleEntityNotFound(res, req))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Category from the DB
exports.remove = (req, res) => {
  req.category
    .deleteMany({parentId:req.params.categoryId}, function (err, result) {
      req.category
        .findByIdAsync(req.params.categoryId)
        .then(handleEntityNotFound(res, req))
        .then(removeEntity(res))
        .catch(handleError(res));
    });
};
