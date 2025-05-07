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
  mode: "test" // Use "live" for production
});

app.get("/pay", (req, res) => {
  const invoice = new paydunya.Invoice();

  invoice.addItem("Test Product", 1, 5000, 5000);
  invoice.description = "Test payment from Shopify integration";
  invoice.totalAmount = 5000;

  invoice.create()
    .then(() => {
      res.redirect(invoice.url);
    })
    .catch((err) => {
      res.status(500).send("Payment creation failed: " + err.message);
    });
});

app.get("/", (req, res) => {
  res.send("Hello, the PayDunya server is working!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


  
