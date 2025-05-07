const express = require('express');
const bodyParser = require('body-parser');
const paydunya = require('paydunya');
const app = express();
const port = process.env.PORT || 3000;

// Set up PayDunya API keys
const setup = paydunya.setup({
  masterKey: 'p0BUuHM8-FUfj-tK5d-jaEr-obgOHMMdDMpB',
  privateKey: 'test_private_x37dj3brXj1z4T4BsclKCCExKFX',
  publicKey: 'test_public_ZTs70WPu5LFhdn3Lbhrq1amGKua',
  token: 'zngSd5eMh1qn6sxCEBJs',
  mode: 'test'
});

// Route to handle payment
app.get('/pay', (req, res) => {
  const Invoice = paydunya.Invoice;

  const invoice = new Invoice();
  invoice.addItem("Product", 1, 5000, 5000);
  invoice.description = "Test payment from Shopify integration";
  invoice.totalAmount = 5000;

  invoice.create()
    .then(() => {
      res.redirect(invoice.url);
    })
    .catch((err) => {
      console.error("PayDunya error:", err);
      res.status(500).send("Payment creation failed: " + err.message);
    });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
