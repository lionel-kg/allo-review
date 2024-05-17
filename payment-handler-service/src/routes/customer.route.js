const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');
const verifyToken = require('../middlewares/verifyToken');
// const verifyOwner = require('../middlewares/verifyOwner');

router.get(
  '/customer-subscription/:id',
  CustomerController.getCustomerSubscription,
);

module.exports = router;
