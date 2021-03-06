const Clients = require('./clients.model');

const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  saveUpdates,
  removeEntity,
  createCollection
} = require('../../utils');

// Gets a list of Clients
exports.index = (req, res) => {
  Clients
    .find()
    .select('-__v')
    .sort({ name: 'desc' })
    .execAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Client in the DB
exports.create = (req, res) => {
  Clients
    .createAsync(req.body)
    .then(createCollection(req.body))
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Gets a single Client from the DB
exports.show = (req, res) => {
  Clients
    .findById(req.params.id)
    .select('id name code url createdAt')
    .execAsync()
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Updates an existing Client in the DB
exports.update = (req, res) => {
  Clients
    .findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(Clients, req.body, req.params.id))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Client from the DB
exports.remove = (req, res) => {
  Clients
    .findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};
