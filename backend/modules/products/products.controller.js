const {
  handleError,
  responseWithResult,
  handleEntityNotFound,
  getProducts,
} = require('../../utils');


// Get a length of Products
exports.index = (req,res) => {
  req.category
    .count()
    .execAsync()
    .then(handleEntityNotFound(res, req))
    .then(responseWithResult(res))
    .catch(handleError(res));
};
// Gets a single Category from the DB
exports.show = (req, res) => {
  let query = "";
  if( req.params.index === "start"){
    query = {};
  }else{
    query = {"_id":req.params.index}
  }
  console.log("query>>>>", query);//fixme
  getProducts(req,res,query)
    .then(handleEntityNotFound(res, req))
    .then(responseWithResult(res))
    .catch(handleError(res));
};
