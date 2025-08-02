const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const pool = require("../db");

// creating stripe session
exports.paymentSession = async (req, res) => {
  try {
    const customer_id = req.customerId;

    const cart = await pool.query(
      "SELECT id FROM cart WHERE customer_id = $1",
      [customer_id]
    );
    const cart_id = cart.rows[0]?.id;
    if (!cart_id) return res.status(400).json({ error: "Cart empty" });

    const items = await pool.query(
      `
    SELECT ci.*, p.name, p.price
    FROM cartitem ci
    JOIN product p ON ci.product_id = p.id
    WHERE ci.cart_id = $1
  `,
      [cart_id]
    );

    const lineItems = items.rows.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order-success`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        customer_id,
        cart_id,
      },
    });

    res.json({ sessionUrl: session.url });
  } catch (error) {
    res.status(500).json({ error: "Process Failed" });
  }
};

// creating webhook
exports.createWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customer_id = parseInt(session.metadata.customer_id);
    const cart_id = parseInt(session.metadata.cart_id);

    const items = await pool.query(
      "SELECT * FROM cartitem WHERE cart_id = $1",
      [cart_id]
    );
    let total = 0;

    for (let item of items.rows) {
      const price = await pool.query(
        "SELECT price FROM product WHERE id = $1",
        [item.product_id]
      );
      total += item.quantity * price.rows[0].price;
    }

    const order = await pool.query(
      "INSERT INTO orders (customer_id, total_amount) VALUES ($1, $2) RETURNING id",
      [customer_id, total]
    );
    const order_id = order.rows[0].id;

    for (let item of items.rows) {
      const price = await pool.query(
        "SELECT price FROM product WHERE id = $1",
        [item.product_id]
      );
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
        [order_id, item.product_id, item.quantity, price.rows[0].price]
      );
    }

    await pool.query("DELETE FROM cartitem WHERE cart_id = $1", [cart_id]);
  }

  res.sendStatus(200);
};
