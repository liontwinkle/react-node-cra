const express = require('express');

const router = express.Router();

const controller = require('./categories.controller');

// Request to get list of Categories
router.get('/', controller.index);

// Request to create a Category
router.post('/', controller.create);

// Request to create a Category
router.post('/updatedefault', controller.updateDefault);

// Request to get a Category
router.get('/:categoryId', controller.show);

// Request to update a Category
router.put('/:categoryId', controller.update);

// Request to remove a Category
router.delete('/:categoryId', controller.remove);

module.exports = router;
