const express = require("express");
const cors = require("cors");
require("dotenv").config();
const adminProductRoutes = require("./routes/adminProductRoutes");
const manufacturerOrderRoutes = require("./routes/manufacturerOrderRoutes");
const customerRoutes = require("./routes/customerRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");

const app = express();

app.use(cors());
app.use("/api/order", checkoutRoutes);
app.use(express.json());

app.use("/api/admin", adminProductRoutes);
app.use("/api/manufacturer", manufacturerOrderRoutes);
app.use("/api/customer", customerRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
