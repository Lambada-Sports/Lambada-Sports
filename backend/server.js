const express = require("express");
const cors = require("cors");
require("dotenv").config();
const adminProductRoutes = require("./routes/adminProductRoutes");
const manufacturerOrderRoutes = require("./routes/manufacturerOrderRoutes");
const customerRoutes = require("./routes/customerRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
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
app.use("/api/order", checkoutRoutes);
app.use("/api/admin", adminProductRoutes);
app.use("/api/manufacturer", manufacturerOrderRoutes);
app.use("/api/customer", checkJwt, attachCustomerId, customerRoutes);

// Error handling middleware (should be last)
app.use(handleJwtError);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
