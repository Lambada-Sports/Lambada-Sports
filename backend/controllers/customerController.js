const pool = require("../db");

// customer fetch products
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM product WHERE LOWER(status) = 'active'"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// customer adding designs
exports.addDesign = async (req, res) => {
  const { product_id, design_data } = req.body;
  const customer_id = req.user.id;

  try {
    const result = await pool.query(
      `INSERT INTO design (customer_id, product_id, design_data) VALUES ($1, $2, $3) RETURNING *`,
      [customer_id, product_id, design_data]
    );
    console.log(" Design saved successfully with ID:", result.rows[0].id);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(" Error saving design:", error);
    res.status(500).json({ error: "Failed to add design" });
  }
};

// customer viewing designs
exports.getDesign = async (req, res) => {
  const customer_id = req.user.id;
  try {
    const result = await pool.query(
      "SELECT * FROM design WHERE customer_id = $1",
      [customer_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to get design" });
  }
};

// view cart items
exports.getCart = async (req, res) => {
  try {
    const customer_id = req.user?.id;
    if (!customer_id) {
      return res.status(401).json({ error: "User not logged in" });
    }

    const items = await pool.query(
      `
      SELECT
        ci.id,
        ci.product_id,          
        ci.quantity,
        p.name        AS product_name,
        p.price       AS product_price,
        p.description       AS product_description,       
        (p.price * ci.quantity) AS line_total
      FROM cartitem ci
      JOIN product p ON ci.product_id = p.id
      WHERE ci.customer_id = $1
      ORDER BY ci.id ASC
      `,
      [customer_id]
    );

    // Normalize numeric types (safer for frontend)
    const normalized = items.rows.map((r) => ({
      id: r.id,
      product_id: r.product_id,

      quantity: Number(r.quantity),
      description: r.description,
      name: r.product_name,
      price: r.product_price !== null ? parseFloat(r.product_price) : 0,
      image: r.product_image,
      line_total: r.line_total !== null ? parseFloat(r.line_total) : 0,
    }));

    res.json(normalized);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// adding to cart
exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;
    const customer_id = req.user.id;

    if (!customer_id) {
      return res.status(401).json({ error: "User not logged in" });
    }

    const item = await pool.query(
      `INSERT INTO cartitem (product_id, quantity, customer_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [product_id, quantity, customer_id]
    );

    res.status(201).json(item.rows[0]);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add to cart" });
  }
};
