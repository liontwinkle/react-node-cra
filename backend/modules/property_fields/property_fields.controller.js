import {respondWith} from "../../utils";

const PropertyFields = require('./property_fields.model');

const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  saveUpdates,
  createProperty,
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
  console.log("clientId",req.params.clientId);//fixme
  PropertyFields
    .deleteMany({clientId:req.params.clientId}, function (err, result) {
      if( result.length > 0 )
        respondWith(res, 204)
    })
    .catch(handleError(res));
};
