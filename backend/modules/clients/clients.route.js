const express = require('express');

const router = express.Router();

const controller = require('./clients.controller');
const { loadClient, loadCategory } = require('./clients.middleware');
const {
  validateCategoryType,
  validateProductType,
  validateAttributeType,
  validateHistoryType
} = require('../validation/validation.controller');

const categoriesRoute = require('../categories/categories.route');
const productsRoute = require('../products/products.route');
const attributeRoute = require('../attributes/attributes.route');
const historyRoute = require('../history/history.route');

// Request to get list of Clients
router.get('/', controller.index);

// Request to create a Client
router.post('/', controller.create);

// Request to get a Client
router.get('/:id', controller.show);

// Request to update a Client
router.put('/:id', controller.update);

// Request to remove a Client
router.delete('/:id', controller.remove);

// Categories route
router.use('/:id/types/:type/categories', validateCategoryType, categoriesRoute);

// Products route
router.use('/:id/types/:type/products', validateProductType, productsRoute);

// Attribute route
router.use('/:id/types/:type/attributes', validateAttributeType, attributeRoute);

// History route
router.use('/:id/types/:type/history', validateHistoryType, historyRoute);
// Attributes route

router.param('id', loadClient);
router.param('type', loadCategory);

module.exports = router;
