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
  let limit = parseInt(req.params.limit);
  let skip = parseInt(req.params.index)* limit;
  req.products
    .find({})
    .limit(limit)
    .skip(skip)
    .execAsync()
    .then(handleEntityNotFound(res, req))
    .then(responseWithResult(res))
    .catch(handleError(res));
};
