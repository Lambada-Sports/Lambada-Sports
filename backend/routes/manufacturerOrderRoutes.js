const express = require("express");
const router = express.Router();
const controller = require("../controllers/manufacturerOrderController");

router.get("/", controller.getAssignedOrders);
router.get("/:id", controller.getOrderDetails);
router.get("/:id/pdf", controller.generateOrderPDF);

module.exports = router;
