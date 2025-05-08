const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// PayDunya credentials (mode test)
const paydunyaConfig = {
  masterKey: 'p0BUuHM8-FUfj-tK5d-jaEr-obgOHMMdDMpB',
  privateKey: 'test_private_PT8WPhFM6n0JJ0XcVTMTExXR3qI',
  publicKey: 'test_public_ulXnPRaxlGAGSznQudRjOSmsnZe',
  token: 'IVgwUfOAXoUJGfRz7x3l',
  mode: 'test'
};

// Test route
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’intégration PayDunya – Shopify');
});

// Route to initiate payment
app.get('/pay', async (req, res) => {
  try {
    const response = await axios.post(
      'https://app.paydunya.com/api/v1/checkout-invoice/create',
      {
        invoice: {
          items: [
            {
              name: 'Test Product',
              quantity: 1,
              unit_price: 5000,
              total_price: 5000,
              description: 'Paiement test via Shopify'
            }
          ],
          total_amount: 5000,
          description: 'Paiement test via Shopify'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'PAYDUNYA-MASTER-KEY': paydunyaConfig.masterKey,
          'PAYDUNYA-PRIVATE-KEY': paydunyaConfig.privateKey,
          'PAYDUNYA-PUBLIC-KEY': paydunyaConfig.publicKey,
          'PAYDUNYA-TOKEN': paydunyaConfig.token,
          'PAYDUNYA-MODE': paydunyaConfig.mode
        }
      }
    );

    const checkoutUrl = response.data?.response?.checkout_url;
    if (checkoutUrl) {
      res.redirect(checkoutUrl);
    } else {
      res.status(500).send('Erreur : lien de paiement introuvable.');
    }
  } catch (error) {
    console.error('Erreur PayDunya :', error.response?.data || error.message);
    res.status(500).send('Erreur lors de la création du paiement.');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
