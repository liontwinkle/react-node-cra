const express = require('express');

const router = express.Router();

const controller = require('./property_fields.controller');

// Request to get list of Categories
router.get('/', controller.index);

// Request to create a Category
router.post('/', controller.create);

// Request to get a Category
router.get('/:clientId/:type', controller.show);

// Request to update a Category
router.put('/:clientId', controller.update);

// Request to remove a Category
router.delete('/:clientId', controller.remove);

module.exports = router;
