const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");
const { verifyCustomer } = require("../middleware/auth");

router.post(
  "/create-session",
  verifyCustomer,
  checkoutController.paymentSession
);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  checkoutController.createWebhook
);

module.exports = router;
