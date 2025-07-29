const PDFDocument = require("pdfkit");
const getStream = require("get-stream");

exports.generatePDF = async (order, items) => {
  const doc = new PDFDocument();
  const buffers = [];

  doc.on("data", buffers.push.bind(buffers));
  doc.on("end", () => {});

  doc.fontSize(16).text(`Order #${order.id}`, { underline: true });
  doc.moveDown().fontSize(12);
  doc.text(`Customer: ${order.customer_name} (${order.email})`);
  doc.text(`Order Date: ${order.order_date}`);
  doc.text(`Status: ${order.status}`);
  doc.moveDown();

  items.forEach((item, i) => {
    doc.text(`Item ${i + 1}: ${item.product_name}`);
    doc.text(`Quantity: ${item.quantity}`);
    doc.text(`Price: ${item.price}`);
    doc.text(`Size: ${item.sizes || "N/A"}`);
    doc.text(`Design: ${JSON.stringify(item.design_data, null, 2)}`);
    doc.moveDown();
  });

  doc.end();
  return await getStream.buffer(doc);
};
