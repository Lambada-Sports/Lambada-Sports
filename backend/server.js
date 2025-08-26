const express = require("express");
const cors = require("cors");
require("dotenv").config();
const adminProductRoutes = require("./routes/adminProductRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const manufacturerOrderRoutes = require("./routes/manufacturerOrderRoutes");
const customerRoutes = require("./routes/customerRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const orderRoutes = require("./routes/orderRoutes");
const {
  checkJwt,
  attachCustomerId,
  handleJwtError,
} = require("./middleware/auth");

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/admin", adminProductRoutes);
app.use("/api/admin", adminOrderRoutes);
app.use("/api/manufacturer", manufacturerOrderRoutes);
app.get(
  "/api/products",
  require("./controllers/customerController").getProducts
);
app.use("/api/webhook", webhookRoutes);
app.use("/api/checkout", checkJwt, attachCustomerId, checkoutRoutes);
app.use("/api/order", checkJwt, attachCustomerId, orderRoutes);
app.use("/api/customer", checkJwt, attachCustomerId, customerRoutes);
app.use(handleJwtError);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
