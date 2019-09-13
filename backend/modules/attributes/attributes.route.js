const express = require('express');

const router = express.Router();

const controller = require('./attributes.controller');

// Request to get list of Categories
router.get('/', controller.index);

// Request to create a Category
router.post('/', controller.create);

// Request to get a Category
// router.get('/:attributeId', controller.show);

// Request to update a Category
// router.put('/:attributeId', controller.update);

// Request to remove a Category
// router.delete('/:attributeId', controller.remove);

module.exports = router;
