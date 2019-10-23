const express = require('express');

const router = express.Router();

const controller = require('./upload.controller');

// Request to get a Upload
router.post('/:clientId/types/:type', controller.upload);
router.post('/key/:clientId/types/:type', controller.keyUpload);

module.exports = router;
