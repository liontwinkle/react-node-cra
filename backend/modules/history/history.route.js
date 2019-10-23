const express = require('express');

const router = express.Router();

const controller = require('./history.controller');

// Request to get list of Categories
router.get('/item/:itemType', controller.index);

// Request to create a Category
router.post('/', controller.create);

// Request to get a Category
router.get('/:historyId', controller.show);


// Request to remove a Category
router.delete('/:itemId', controller.remove);

module.exports = router;
