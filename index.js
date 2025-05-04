const express = require("express");
const bodyParser = require("body-parser");
const paydunya = require("paydunya");
const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

// Configuration de PayDunya
paydunya.setup({
  masterKey: process.env.MASTER_KEY,
  privateKey: process.env.PRIVATE_KEY,
  publicKey: process.env.PUBLIC_KEY,
  token: process.env.TOKEN,
  mode: "test" // Change à "live" lorsque prêt
});

// Route pour créer la facture
app.get("/pay", async (req, res) => {
  console.log("Requête reçue à /pay");  // Ajout du log pour savoir si la route est atteinte
  
  const invoice = new paydunya.Invoice();

  // Ajout d'un produit à la facture
  invoice.addItem("Product", 1, 5000, 5000); // Nom, quantité, prix unitaire, prix total
  invoice.description = "Test payment from Shopify integration";
  invoice.totalAmount = 5000;

  try {
    console.log("Tentative de création de la facture...");
    const success = await invoice.create();
    console.log("Facture créée: ", success);  // Ajoute un log pour savoir si la facture a été créée
    
    if (success) {
      console.log("Redirection vers l'URL de paiement PayDunya: ", invoice.url);  // Log de l'URL vers laquelle on redirige
      res.redirect(invoice.url);  // Si la facture est créée, on redirige vers PayDunya
    } else {
      console.error("Échec de la création de la facture.");
      res.status(500).send("Échec de la création

