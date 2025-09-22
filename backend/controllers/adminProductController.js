const pool = require("../db");

exports.getAllProducts = async (req, res) => {
  try {
    const results = await pool.query(
      "SELECT * FROM product ORDER BY created_date DESC"
    );
    res.json(results.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM product WHERE id = $1", [
      id,
    ]);
    if (result.rows.length == 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.addProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    type,
    sport,
    status = "active",
    stock = 0,
    min_stock_level = 0,
    max_stock_level = 0,
  } = req.body;

  try {
    const product = await pool.query(
      `INSERT INTO product (name, description, price, type, sport, status, stock, min_stock_level, max_stock_level)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        name,
        description,
        price,
        type,
        sport,
        status,
        stock,
        min_stock_level,
        max_stock_level,
      ]
    );
    res.status(201).json(product.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to create product" });
  }
};

exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    type,
    sport,
    status,
    stock,
    min_stock_level,
    max_stock_level,
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE product SET
       name=$1, description=$2, price=$3, type=$4, sport=$5, status=$6,
       stock=$7, min_stock_level=$8, max_stock_level=$9
       WHERE id=$10 RETURNING *`,
      [
        name,
        description,
        price,
        type,
        sport,
        status,
        stock,
        min_stock_level,
        max_stock_level,

        id,
      ]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Product not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM product WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
};
