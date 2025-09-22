const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

router.get("/products", customerController.getProducts);
router.post("/design", customerController.addDesign);
router.get("/design", customerController.getDesign);
router.get("/cart", customerController.getCart);
router.post("/cart", customerController.addToCart);

module.exports = router;
