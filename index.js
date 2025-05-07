const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// PayDunya API credentials
const PAYDUNYA_CONFIG = {
  masterKey: 'p0BUuHM8-FUfj-tK5d-jaEr-obgOHMMdDMpB',
  privateKey: 'test_private_x37dj3brXj1z4T4BsclKCCExKFX',
  publicKey: 'test_public_ZTs70WPu5LFhdn3Lbhrq1amGKua',
  token: 'zngSd5eMh1qn6sxCEBJs',
  mode: 'test', // Change to 'live' when ready
};

const BASE_URL =
  PAYDUNYA_CONFIG.mode === 'live'
    ? 'https://app.paydunya.com/api/v1/checkout-invoice/create'
    : 'https://app.paydunya.com/sandbox-api/v1/checkout-invoice/create';

app.get('/pay', async (req, res) => {
  try {
    const response = await axios.post(
      BASE_URL,
      {
        invoice: {
          items: [
            {
              name: 'Product',
              quantity: 1,
              unit_price: 5000,
              total_price: 5000,
              description: 'Test payment from Shopify',
            },
          ],
          total_amount: 5000,
