const clientTypes = ['native', 'virtual', 'attributes', 'products'];

function validateType(req, res, next) {
  if (clientTypes.indexOf(req.params.type) === -1) {
    return res
      .status(403)
      .json({ message: 'Category type is invalid.' });
  }

  return next();
}

module.exports = {
  validateType,
};
