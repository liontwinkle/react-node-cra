const clientCategoryTypes = ['native', 'virtual'];
const clientProductType = ['products'];
const clientAttributeType = ['attributes'];

function validateCategoryType(req, res, next) {
  if (clientCategoryTypes.indexOf(req.params.type) === -1) {
    return res
      .status(403)
      .json({ message: 'Category type is invalid.' });
  }

  return next();
}

function validateProductType(req, res, next) {
  if (clientProductType.indexOf(req.params.type) === -1) {
    return res
      .status(403)
      .json({ message: 'Product type is invalid.' });
  }

  return next();
}

function validateAttributeType(req, res, next) {
  if (clientAttributeType.indexOf(req.params.type) === -1) {
    return res
      .status(403)
      .json({ message: 'Attribute type is invalid.' });
  }

  return next();
}


module.exports = {
  validateCategoryType,
  validateProductType,
  validateAttributeType,
};
