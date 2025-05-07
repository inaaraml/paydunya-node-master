app.get("/pay", async (req, res) => {
  const invoice = new paydunya.Invoice();

  invoice.addItem("Test Product", 1, 5000, 5000);
  invoice.description = "Test payment from Shopify integration";
  invoice.totalAmount = 5000;

  try {
    const success = await invoice.create();
    if (success) {
      res.redirect(invoice.url);
    } else {
      // Show full PayDunya error on the page
      res.status(500).send(`
        <h1>Payment creation failed</h1>
        <pre>${JSON.stringify(invoice.response_text, null, 2)}</pre>
      `);
    }
  } catch (err) {
    res.status(500).send(`
      <h1>Error</h1>
      <pre>${err.message}</pre>
    `);
  }
});


