const pool = require("../db");
const { generatePDF } = require("../utils/generatePDF");

exports.getAssignedOrders = async (req, res) => {
  const manufacturerId = req.user?.manufacturerId || 1;

  try {
    const result = await pool.query(
      `
      SELECT o.*, c.name AS customer_name, c.email
      FROM orders o
      JOIN customer c ON o.customer_id = c.id
      WHERE assigned_manufacturer_id = $1
      ORDER BY o.order_date DESC
    `,
      [manufacturerId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

exports.getDesignPDF = async (req, res) => {
  const { id } = req.params;

  try {
    const orderRes = await pool.query(
      `
      SELECT o.*, c.name AS customer_name, c.email
      FROM orders o
      JOIN customer c ON o.customer_id = c.id
      WHERE o.id = $1
    `,
      [id]
    );

    const itemsRes = await pool.query(
      `
      SELECT oi.*, p.name AS product_name, d.design_data
      FROM order_items oi
      JOIN product p ON oi.product_id = p.id
      LEFT JOIN design d ON d.product_id = p.id
      WHERE oi.order_id = $1
    `,
      [id]
    );

    const pdfBuffer = await generatePDF(orderRes.rows[0], itemsRes.rows);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=order_${id}.pdf`,
    });
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
};
