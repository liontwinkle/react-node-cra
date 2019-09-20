const express = require('express');

const router = express.Router();

const controller = require('./history.controller');

// Request to get list of Categories
router.get('/item/:itemType', controller.index);

// Request to create a Category
router.post('/', controller.create);

// Request to get a Category
router.get('/:historyId', controller.show);

// Request to update a Category
router.put('/:historyId', controller.update);

// Request to remove a Category
router.delete('/:historyId', controller.remove);

module.exports = router;
