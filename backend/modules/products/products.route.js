const express = require('express');

const router = express.Router();

const controller = require('./products.controller');

// Request to get a Category
router.get('/', controller.show);
router.put('/', controller.update);

module.exports = router;
