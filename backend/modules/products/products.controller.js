const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
} = require('../../utils');


// Gets a single Category from the DB
exports.show = (req, res) => {
  req.products
    .find()
    .execAsync()
    .then(handleEntityNotFound(res, req))
    .then(responseWithResult(res))
    .catch(handleError(res));
};
