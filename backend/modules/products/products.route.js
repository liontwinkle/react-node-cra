const express = require('express');

const router = express.Router();

const controller = require('./products.controller');

// Request to get a Category
router.get('/', controller.show);

module.exports = router;
