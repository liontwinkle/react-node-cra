const express = require('express');

const router = express.Router();

const controller = require('./attributes.controller');

// Request to get list of Attributes
router.get('/', controller.index);

// Request to create a Attribute
router.post('/', controller.create);

// Request to remove all apear Id from Attribute
router.post('/appear', controller.removeAppearId);

// Request to get a Attribute
router.get('/:attributeId', controller.show);

// Request to update a Attribute
router.put('/:attributeId', controller.update);

// Request to remove a Attribute
router.delete('/:attributeId', controller.remove);

module.exports = router;
