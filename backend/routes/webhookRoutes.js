const express = require("express");
const router = express.Router();
const checkoutController = require("../controllers/checkoutController");

router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  checkoutController.handleWebhook
);

module.exports = router;
