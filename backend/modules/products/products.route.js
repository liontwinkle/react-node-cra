const express = require('express');

const router = express.Router();

const controller = require('./products.controller');

// Request to get a Category
router.get('/:index/:limit', controller.show);
router.get('/', controller.index);

module.exports = router;
