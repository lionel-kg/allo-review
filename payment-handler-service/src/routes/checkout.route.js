const express = require('express');
const router = express.Router();
const CheckoutController = require('../controllers/checkout.controller');
const verifyToken = require('../middlewares/verifyToken');
// const verifyOwner = require('../middlewares/verifyOwner');

router.post(
  '/create-checkout-session',
  verifyToken,
  CheckoutController.createCheckoutSession,
);
router.post(
  '/create-portal-session',
  verifyToken,
  CheckoutController.createPortalSession,
);

module.exports = router;
