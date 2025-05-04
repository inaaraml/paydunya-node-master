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
app.get("/pay", (req, res) => {
  const invoice = new paydunya.Invoice();
  
  // Add a product to the invoice
  invoice.addItem("Product Name", 1, 5000); // name, quantity, unit price
  invoice.setTotalAmount(5000);
  invoice.setDescription("Paiement de test depuis Shopify");

  // Create the invoice
  invoice.create((response) => {
    if (response.response_code === "00") {
      console.log("Invoice created successfully:", response.invoice_url);
      res.redirect(response.invoice_url); // Redirect to PayDunya payment page
    } else {
      console.error("Invoice creation failed:", response.response_text);
      res.status(500).send("Erreur: " + response.response_text);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Serveur actif. Visitez /pay pour tester PayDunya.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

  
