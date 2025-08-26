const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");

router.post(
  "/create-session",

  checkoutController.paymentSession
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  checkoutController.createWebhook
);

module.exports = router;
