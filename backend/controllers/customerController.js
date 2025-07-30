const pool = require("../db");

// customer fetch products
exports.getProducts = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM product WHERE status = 'active'"
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
    if (cartResult.rows.length === 0) return res.json([]);

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
    res.json(items.rows);
  } catch (error) {
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
    res.status(500).json({ error: "Failed to add to cart" });
    return;
  }
};

// place orders
exports.placeOrder = async (req, res) => {
  try {
    const customer_id = req.customerId;

    // Step 1: Get cart
    const cartResult = await pool.query(
      "SELECT id FROM cart WHERE customer_id = $1",
      [customer_id]
    );
    if (cartRes.rows.length === 0)
      return res.status(400).json({ error: "Cart is empty" });

    const cart_id = cartRes.rows[0].id;
    const itemsResult = await pool.query(
      "SELECT * FROM cartitem WHERE cart_id = $1",
      [cart_id]
    );

    if (itemsResult.rows.length === 0)
      return res.status(400).json({ error: "No items to order" });

    // Step 2: Create Order
    const total = itemsResult.rows.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    ); // price may need to be fetched from `product`
    const order = await pool.query(
      "INSERT INTO orders (customer_id, total_amount) VALUES ($1, $2) RETURNING *",
      [customer_id, total]
    );

    // Step 3: Add items to order_items
    for (const item of itemsResult.rows) {
      const priceResult = await pool.query(
        "SELECT price FROM product WHERE id = $1",
        [item.product_id]
      );
      const price = priceResult.rows[0].price;

      await pool.query(
        `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4)
    `,
        [order.rows[0].id, item.product_id, item.quantity, price]
      );
    }

    // Step 4: Clear cart
    await pool.query("DELETE FROM cartitem WHERE cart_id = $1", [cart_id]);

    res
      .status(201)
      .json({ message: "Order placed", order_id: order.rows[0].id });
  } catch (error) {
    res.status(500).json({ error: "Failed to place the order" });
    return;
  }
};
