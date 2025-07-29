const express = require("express");
const cors = require("cors");
const pool = require("./db");
require("dotenv").config();
const adminProductRoutes = require("./routes/adminProductRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/admin", adminProductRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
