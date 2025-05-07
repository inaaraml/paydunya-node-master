const express = require("express");
const bodyParser = require("body-parser");
const paydunya = require("paydunya");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// PayDunya Setup
paydunya.setup({
  masterKey: process.env.MASTER_KEY,
  privateKey: process.env.PRIVATE_KEY,
  publicKey: process.env.PUBLIC_KEY,
  token: process.env.TOKEN,
  mode: "test" // Change to "live" when you're ready
});

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
      console.error("Invoice creation failed:", invoice.response_text);
      res.status(500).send("Payment creation failed: " + invoice.response_text);
    }
  } catch (err) {
    console.error("Error during invoice creation:", err);
    res.status(500).send("Error: " + err.message);
  }
});

app.get("/", (req, res) => {
  res.send("Hello, the PayDunya server is working!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

