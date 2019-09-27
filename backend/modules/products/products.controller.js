const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
} = require('../../utils');


// Gets a single Category from the DB
exports.show = (req, res) => {
  req.products
    .find()
    .sort('_id')
    .limit(100)
    .execAsync()
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

exports.update = (req, res) => {
  const query = [];
  req.body.forEach((item) => {
    query.push(item._id);
  });

  // delete section
  req.products
    .deleteMany({ _id: { $in: query } }, (err) => {
      if (err) {
        handleError(err);
      }
    });
  req.products
    .insertMany(req.body, (err, result) => {
      if (err) {
        handleError(res);
      } else {
        res.status(201).json(result);
      }
    });
};
