const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const paydunyaConfig = {
  masterKey: 'p0BUuHM8-FUfj-tK5d-jaEr-obgOHMMdDMpB',
  privateKey: 'test_private_x37dj3brXj1z4T4BsclKCCExKFX',
  publicKey: 'test_public_ZTs70WPu5LFhdn3Lbhrq1amGKua',
  token: 'zngSd5eMh1qn6sxCEBJs',
  mode: 'test',
};

// Route to test PayDunya payment
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
            description: 'Paiement test via Shopify',
          },
        ],
        total_amount: 5000,
        description: 'Paiement test',
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': paydunyaConfig.masterKey,
        'PAYDUNYA-PRIVATE-KEY': paydunyaConfig.privateKey,
        'PAYDUNYA-PUBLIC-KEY': paydunyaConfig.publicKey,
        'PAYDUNYA-TOKEN': paydunyaConfig.token,
        'PAYDUNYA-MODE': paydunyaConfig.mode,
      },
    });

    const invoiceUrl = response.data.response.checkout_url;
    res.redirect(invoiceUrl);
  } catch (error) {
    console.error('Payment creation error:', error.response?.data || error.message);
    res.status(500).send('Erreur lors de la création du paiement.');
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
