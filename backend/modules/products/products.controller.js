const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
} = require('../../utils');


// Get a length of Products
exports.index = (req,res) => {
  req.products
    .find().count()
    .execAsync()
    .then(handleEntityNotFound(res, req))
    .then(responseWithResult(res))
    .catch(handleError(res));
};
// Gets a single Category from the DB
exports.show = (req, res) => {
  let limit = 50;
  let skip = parseInt(req.params.index)* 50;
  req.products
    .find({})
    .limit(limit)
    .skip(skip)
    .execAsync()
    .then(handleEntityNotFound(res, req))
    .then(responseWithResult(res))
    .catch(handleError(res));
};
