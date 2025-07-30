const express = require("express");
const router = express.Router();
const productController = require("../controllers/adminProductController");

router.get("/products", productController.getAllProducts);
router.get("/products/:id", productController.getProductById);
router.post("/products/add", productController.addProduct);
router.put("/products/edit", productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
