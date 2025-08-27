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
      success_url: `${process.env.FRONTEND_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
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

// Webhook to handle payment confirmation
exports.handleWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  console.log("Webhook received - processing...");

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log(`Webhook event type: ${event.type}`);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const customer_id = session.metadata.customer_id;
    const payment_intent_id = session.payment_intent;

    console.log(
      `Processing checkout.session.completed for customer: ${customer_id}, payment_intent: ${payment_intent_id}`
    );

    try {
      // Store payment confirmation in database for order creation
      await pool.query(
        `INSERT INTO payments (customer_id, payment_intent_id, session_id, status, created_at) 
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
         ON CONFLICT (payment_intent_id) DO UPDATE SET status = $4`,
        [customer_id, payment_intent_id, session.id, "completed"]
      );

      console.log(
        `Payment confirmed for customer: ${customer_id}, payment_intent: ${payment_intent_id}`
      );
    } catch (error) {
      console.error("Error storing payment confirmation:", error);
      return res.status(500).send("Error processing payment confirmation");
    }
  } else {
    console.log(`Ignoring webhook event type: ${event.type}`);
  }

  res.sendStatus(200);
};

// Check payment status
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { session_id } = req.params;
    const customer_id = req.customerId;

    console.log(
      `Checking payment status for session: ${session_id}, customer: ${customer_id}`
    );

    const session = await stripe.checkout.sessions.retrieve(session_id);

    console.log(`Stripe session details:`, {
      payment_status: session.payment_status,
      payment_intent: session.payment_intent,
      customer: session.customer,
      metadata: session.metadata,
    });

    if (session.payment_status === "paid") {
      // Check if payment confirmation exists
      const confirmation = await pool.query(
        "SELECT * FROM payments WHERE customer_id = $1 AND session_id = $2 AND status = 'completed'",
        [customer_id, session_id]
      );

      console.log(
        `Payment confirmation check: ${confirmation.rows.length} records found`
      );

      if (confirmation.rows.length > 0) {
        console.log(`Payment confirmed - ready for order creation`);
        res.json({
          payment_status: "completed",
          payment_intent_id: session.payment_intent,
          ready_for_order: true,
        });
      } else {
        console.log(
          `Payment paid but no confirmation record found - creating one now`
        );

        // If payment is paid but no confirmation record exists, create it
        try {
          await pool.query(
            `INSERT INTO payments (customer_id, payment_intent_id, session_id, status, created_at) 
             VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
             ON CONFLICT (payment_intent_id) DO UPDATE SET status = $4`,
            [customer_id, session.payment_intent, session_id, "completed"]
          );

          console.log(`Payment confirmation record created`);

          res.json({
            payment_status: "completed",
            payment_intent_id: session.payment_intent,
            ready_for_order: true,
          });
        } catch (dbError) {
          console.error("Error creating payment confirmation:", dbError);
          res.json({
            payment_status: "processing",
            ready_for_order: false,
          });
        }
      }
    } else {
      console.log(`Payment not yet paid - status: ${session.payment_status}`);
      res.json({
        payment_status: session.payment_status,
        ready_for_order: false,
      });
    }
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ error: "Failed to check payment status" });
  }
};
