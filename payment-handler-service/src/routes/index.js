const express = require('express');
const router = express.Router();
const checkoutRouter = require('./checkout.route');
const webhookRouter = require('./webhook.route');
const customerRouter = require('./customer.route');

router.use('', checkoutRouter);
router.use('', express.raw({type: 'application/json'}), webhookRouter);
router.use('', customerRouter);

module.exports = router;
