const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  saveAttributeUpdates,
  handleAttributeCreate,
  handleAttributeFetch,
  removeEntity,
  removeAttribute,
  handleAppearRemove
} = require('../../utils');

// Gets a list of Categories
exports.index = (req, res) => {
  req.attributes
    .find()
    .select('-__v')
    .execAsync()
    .then(handleAttributeFetch(req, res))
    .catch(handleError(res));
};

// Creates a new Attribute in the DB
exports.create = (req, res) => {
  req.attributes
    .find()
    .then(handleAttributeCreate(req, res))
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
    .then(saveAttributeUpdates(req, res))
    .catch(handleError(res));
};

// Update a Category all default
exports.updateDefault = (req, res) => {
  req.attributes.updateMany({}, { $set: { defaultProperties: req.body.updatedData } },
    (err, result) => {
      if (!err) {
        if (req.body.deletedKey) {
          const deleteKey = req.body.deletedKey;
          req.attributes.find({}, (err, result) => {
            if (!err) {
              result.forEach((resultItem) => {
                if (resultItem.properties) {
                  if (resultItem.properties[deleteKey]) {
                    delete resultItem.properties[deleteKey];

                    req.attributes.updateMany({ _id: resultItem._id }, {
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
  req.attributes
    .findByIdAsync(req.params.attributeId)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .then(removeAttribute(req, req.params.attributeId))
    .catch(handleError(res));
};

// Remove a Appear Id from the Attribute
exports.removeAppearId = (req, res) => {
  req.attributes
    .find()
    .then(handleAppearRemove(req))
    .then(responseWithResult(res))
    .catch(handleError(res));
};
