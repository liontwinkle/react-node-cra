const express = require('express');

const router = express.Router();

const controller = require('./property-fields.controller');

// Request to get list of Properties
router.get('/', controller.index);

// Request to create a Properties
router.post('/', controller.create);

// Request to get a Properties
router.get('/:clientId/:type', controller.show);

// Request to update a Properties
router.put('/:id', controller.update);

// Request to remove a Properties
router.delete('/:clientId', controller.remove);

module.exports = router;
