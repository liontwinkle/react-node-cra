const express = require('express');

const router = express.Router();

const controller = require('./upload.controller');

// Request to get a Upload
router.post('/:clientId/types/:type/id/:id', controller.upload);

module.exports = router;
