const express = require("express");
const bodyParser = require("body-parser");
const paydunya = require("paydunya");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// PayDunya setup
paydunya.setup({
  masterKey: process.env.MASTER_KEY,
  privateKey: process.env.PRIVATE_KEY,
  publicKey: process.env.PUBLIC_KEY,
  token: process.env.TOKEN,
  mode: "test" // change to "live" when ready
});

// Route to create invoice
app.get("/pay", async (req, res) => {
  const invoice = new paydunya.Invoice();

  invoice.addItem("Product", 1, 5000, 5000); // name, quantity, unit price, total price
  invoice.description = "Test payment from Shopify integration";
  invoice.totalAmount = 5000;

  try {
    const success = await invoice.create();

    if (success) {
      console.log("Invoice created successfully:", invoice.url);
      res.redirect(invoice.url); // Redirect to PayDunya payment page
    } else {
      console.error("Invoice creation failed:", invoice.response_text);
      res.status(500).send("Payment creation failed: " + invoice.response_text);
    }
  } catch (err) {
    console.error("Error while creating invoice:", err);
    res.status(500).send("Error: " + err.message);
  }
});

app.get("/", (req, res) => {
  res.send("Server is up and running. Go to /pay to test the payment.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
