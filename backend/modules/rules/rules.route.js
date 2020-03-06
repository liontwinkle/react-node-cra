const express = require('express');

const router = express.Router();

const controller = require('./rules.controller');

// Request to get the products with ruleID
router.get('/client/:clientId/types/:type/entity/:entityId/rule/:ruleIndex', controller.getProductsByRule);

// Request to get the products with rules
router.get('/client/:clientId/types/:type/entity/:entityId/rules', controller.getProductsByRules);

module.exports = router;
