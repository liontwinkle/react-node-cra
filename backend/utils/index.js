const db = require('mongoose').connection;
const _ = require('lodash');
const ValidationError = require('mongoose').Error.ValidationError;

function handleError(res, statusCode = 500) {
  return err => {
    if (err) {
      if (err.statusCode) {
        statusCode = err.statusCode;
      } else if (err instanceof ValidationError) {
        statusCode = 422;
      }

      console.error(err);
      res.status(statusCode);
      res.send(err);
    }
  };
}

function respondWith(res, statusCode = 200) {
  return () => {
    res.status(statusCode).end();
  };
}

function responseWithResult(res, statusCode = 200) {
  return entity => {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res, req) {
  return entity => {
    if (!entity) {
      res.status(404).end();
      return Promise.reject(entity);
    }
    return entity;
  };
}

function handleExistingRemove( collection, req, newData, res) {
  console.log('prepare>>>>', newData);//fixme
  collection.find({clientId: req.params.clientId},function (err, findRes) {
    if( !err ){
      console.log('response>>>>', findRes);//fixme
      if (findRes.length > 0 ) {
        console.log("here delete>>>");//fixme
        collection.deleteMany({clientId: req.params.clientId},function () {
          console.log('insert section>>>');//fixme
          collection.create(newData, function (err, insertResult) {
            if( !err ){
              console.log('inserted>>>', insertResult);//fixme
              res.status(200).json(insertResult);
            }
          })
        });
      }
      else{
        collection.create(newData, function (err, insertResult) {
          if( !err ){
            console.log('inserted>>>', insertResult);//fixme
            res.status(200).json(insertResult);
          }
        })
      }
    }
  });
}

function saveUpdates(updates) {
  return entity => {
    if (updates) {
      _.assign(entity, updates);
    }
    return entity.saveAsync();
  };
}


function removeEntity(res) {
  return entity => entity && entity.removeAsync().then(respondWith(res, 204));
}

function removeChildren( req, id ){
  req.category.find({parentId: id}).then(
    (result)=>{
      req.category
        .deleteMany({parentId:id}, function (err, result) {
      });
      if( result.length > 0 ){
        result.forEach((item)=>{
          removeChildren( req, item._id );
        });
      }else{
        req.category
          .deleteOne({parentId:id}, function (err, result) {
          });
      }
    }
  );
}

function createCollection( body ){
  let fileName = [
    body.code + "_virtuals",
    body.code + "_native",
    body.code + "_products",
    body.code + "_attributes",
  ];
  fileName.forEach(item=>{
    db.createCollection(item, function () {});
  });
}

module.exports = {
  handleError,
  respondWith,
  removeChildren,
  responseWithResult,
  handleEntityNotFound,
  saveUpdates,
  removeEntity,
  createCollection,
  handleExistingRemove,
};
