const express = require("express");
const router = express.Router();
const mailRouter = require("./mail.route");
const smsRouter = require("./sms.route");

router.use("/mail", mailRouter);
router.use("/sms", smsRouter);
module.exports = router;
