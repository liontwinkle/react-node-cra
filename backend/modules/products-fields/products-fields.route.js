const express = require('express');

const router = express.Router();

const controller = require('./products-fields.controller');

// Request to get a Category
router.get('/:clientId', controller.show);

// Request to update a Category
router.put('/:clientId', controller.update);

// Request to remove a Category
router.delete('/:clientId', controller.remove);

module.exports = router;
