const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  saveCategoriesUpdates,
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
    .then(saveCategoriesUpdates(req))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Update a Category all default
exports.updateDefault = (req, res) => {
  req.category.updateMany({}, {
    $set: {
      defaultProperties: req.body.updateData
    }
  }, (err, result) => {
    if (!err) {
      if (req.body.deletedKey) {
        const deleteKey = req.body.deletedKey;
        req.category.find({}, (err, result) => {
          if (!err) {
            result.forEach((resultItem) => {
              if (resultItem.properties) {
                if (resultItem.properties[deleteKey]) {
                  delete resultItem.properties[deleteKey];

                  req.category.updateMany({ categoryId: resultItem.categoryId }, {
                    $set: {
                      properties: resultItem.properties
                    }
                  }, (err) => {
                    if (err) {
                      console.log(err);
                    }
                  });
                }
              }
            });
          }
        });
      }
      res.status(200).json(result);
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
