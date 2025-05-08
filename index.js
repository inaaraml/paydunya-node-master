// fichier: index.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const paydunyaConfig = {
  masterKey: process.env.PAYDUNYA_MASTER_KEY,
  privateKey: process.env.PAYDUNYA_PRIVATE_KEY,
  publicKey: process.env.PAYDUNYA_PUBLIC_KEY,
  token: process.env.PAYDUNYA_TOKEN,
  mode: 'test' // ou 'live' si tu passes en production
};

app.get('/', (req, res) => {
  res.send('Bienvenue sur PayDunya SoftPay pour Shopify');
});

app.post('/pay', async (req, res) => {
  try {
    const invoiceData = {
      invoice: {
        items: [
          {
            name: 'Produit Shopify',
            quantity: 1,
            unit_price: 5000,
            total_price: 5000,
            description: 'Paiement via Shopify'
          }
        ],
        total_amount: 5000,
        description: 'Facture Shopify'
      }
    };

    const headers = {
      'Content-Type': 'application/json',
      'PAYDUNYA-MASTER-KEY': paydunyaConfig.masterKey,
      'PAYDUNYA-PRIVATE-KEY': paydunyaConfig.privateKey,
      'PAYDUNYA-PUBLIC-KEY': paydunyaConfig.publicKey,
      'PAYDUNYA-TOKEN': paydunyaConfig.token,
      'PAYDUNYA-MODE': paydunyaConfig.mode
    };

    const response = await axios.post('https://app.paydunya.com/api/v1/checkout-invoice/create', invoiceData, { headers });
    const checkoutUrl = response.data?.response?.checkout_url;

    if (checkoutUrl) {
      res.status(200).json({ url: checkoutUrl });
    } else {
      res.status(500).json({ error: 'Aucun lien de paiement retourné.' });
    }
  } catch (error) {
    console.error('Erreur:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erreur lors de la création du paiement.' });
  }
});

app.listen(port, () => {
  console.log(`Serveur PayDunya actif sur le port ${port}`);
});
