const express = require("express");
const bodyParser = require("body-parser");
const paydunya = require("paydunya");
const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

// PayDunya configuration
paydunya.setup({
  masterKey: process.env.MASTER_KEY,
  privateKey: process.env.PRIVATE_KEY,
  publicKey: process.env.PUBLIC_KEY,
  token: process.env.TOKEN,
  mode: "test", // Use "live" in production
});

// Payment route
app.get("/pay", async (req, res) => {
  const invoice = new paydunya.Invoice();

  invoice.addItem("Commande Shopify", 1, 5000, 5000);
  invoice.description = "Paiement Shopify via PayDunya";
  invoice.totalAmount = 5000;

  try {
    const success = await invoice.create();
    if (success) {
      res.redirect(invoice.url); // Redirect to PayDunya payment page
    } else {
      res.status(500).send("Échec de la création de la facture.");
    }
  } catch (err) {
    res.status(500).send("Erreur : " + err.message);
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Serveur PayDunya opérationnel !");
});

app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});

  
