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
  const customer_id = req.customerId;

  try {
    const result = await pool.query(
      `INSERT INTO design (customer_id, product_id, design_data) VALUES ($1, $2, $3) RETURNING *`,
      [customer_id, product_id, design_data]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Failed to add design" });
  }
};

// customer viewing designs
exports.getDesign = async (req, res) => {
  const customer_id = req.customerId;
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
    const customer_id = req.customerId;

    const cartResult = await pool.query(
      "SELECT id FROM cart WHERE customer_id = $1",
      [customer_id]
    );

    if (cartResult.rows.length === 0) {
      console.log(" No cart found for customer, returning empty array");
      return res.json([]);
    }

    const cart_id = cartResult.rows[0].id;

    const items = await pool.query(
      `
    SELECT ci.*, p.name, d.design_data
    FROM cartitem ci
    JOIN product p ON ci.product_id = p.id
    LEFT JOIN design d ON ci.design_id = d.id
    WHERE ci.cart_id = $1
  `,
      [cart_id]
    );
    console.log(" Cart items found:", items.rows);
    res.json(items.rows);
  } catch (error) {
    console.error(" Error in getCart:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
    return;
  }
};

// add items to cart
exports.addToCart = async (req, res) => {
  try {
    const { product_id, design_id, sizes, quantity, customer_note } = req.body;
    const customer_id = req.customerId;

    let cart_id;
    const cartResult = await pool.query(
      "SELECT id FROM cart WHERE customer_id = $1",
      [customer_id]
    );
    if (cartResult.rows.length === 0) {
      const newCart = await pool.query(
        "INSERT INTO cart (customer_id) VALUES ($1) RETURNING id",
        [customer_id]
      );
      cart_id = newCart.rows[0].id;
    } else {
      cart_id = cartResult.rows[0].id;
    }

    const item = await pool.query(
      `
    INSERT INTO cartitem (cart_id, product_id, design_id, sizes, quantity, customer_note)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [cart_id, product_id, design_id, sizes, quantity, customer_note]
    );

    res.status(201).json(item.rows[0]);
  } catch (error) {
    console.error(" Error adding to cart:", error);
    res
      .status(500)
      .json({ error: "Failed to add to cart", details: error.message });
    return;
  }
};
