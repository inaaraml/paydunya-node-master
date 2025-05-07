const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// PayDunya API credentials
const paydunyaConfig = {
  masterKey: 'p0BUuHM8-FUfj-tK5d-jaEr-obgOHMMdDMpB',
  privateKey: 'test_private_x37dj3brXj1z4T4BsclKCCExKFX',
  publicKey: 'test_public_ZTs70WPu5LFhdn3Lbhrq1amGKua',
  token: 'zngSd5eMh1qn6sxCEBJs',
  mode: 'test'
};

// Test homepage route
app.get('/', (req, res) => {
  res.send('Bienvenue sur l’intégration PayDunya – Shopify');
});

// Route to create payment invoice
app.get('/pay', async (req, res) => {
  try {
    const response = await axios.post('https://app.paydunya.com/api/v1/checkout-invoice/create', {
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
        description: 'Paiement test'
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'p0BUuHM8-FUfj-tK5d-jaEr-obgOHMMdDMpB': paydunyaConfig.masterKey,
        'test_private_x37dj3brXj1z4T4BsclKCCExKFX': paydunyaConfig.privateKey,
        'test_public_ZTs70WPu5LFhdn3Lbhrq1amGKua': paydunyaConfig.publicKey,
        'zngSd5eMh1qn6sxCEBJs': paydunyaConfig.token,
        'test': paydunyaConfig.mode
      }
    });

    console.log('PayDunya response:', response.data);

    const checkoutUrl = response.data?.response?.checkout_url;

    if (checkoutUrl) {
      res.redirect(checkoutUrl);
    } else {
      res.status(500).send('Erreur: Lien de paiement introuvable.');
    }
  } catch (error) {
    console.error('Erreur PayDunya:', error.response?.data || error.message);
    res.status(500).send('Erreur lors de la création du paiement.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});
