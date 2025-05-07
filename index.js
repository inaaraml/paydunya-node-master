const express = require('express');
const bodyParser = require('body-parser');
const paydunya = require('paydunya');
const app = express();
const port = process.env.PORT || 3000;

// Set up PayDunya API keys
const MASTER_KEY = 'p0BUuHM8-FUfj-tK5d-jaEr-obgOHMMdDMpB';  // Replace with your PayDunya master key
const PRIVATE_KEY = 'test_private_x37dj3brXj1z4T4BsclKCCExKFX'; // Replace with your PayDunya private key
const PUBLIC_KEY = 'test_public_ZTs70WPu5LFhdn3Lbhrq1amGKua';  // Replace with your PayDunya public key
const TOKEN = 'zngSd5eMh1qn6sxCEBJs';            // Replace with your PayDunya token

// Initialize PayDunya with the API keys
paydunya.setup({
  masterKey: MASTER_KEY,
  privateKey: PRIVATE_KEY,
  publicKey: PUBLIC_KEY,
  token: TOKEN,
  mode: 'test' // Change to 'live' once you're ready to go live
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Route to handle the PayDunya payment process
app.get('/pay', async (req, res) => {
  // Create a new invoice
  const invoice = new paydunya.Invoice();

  // Add an item to the invoice (name, quantity, unit price, total price)
  invoice.addItem('Product', 1, 5000, 5000);  // Adjust the values as needed

  // Additional details for the invoice
  invoice.description = 'Test payment from Shopify integration';
  invoice.totalAmount = 5000;  // Total amount to be paid

  try {
    // Create the invoice and check if it's successful
    const success = await invoice.create();
    if (success) {
      // Redirect the user to PayDunya's payment page
      res.redirect(invoice.url);
    } else {
      // Handle the error if the invoice creation fails
      res.status(500).send('Payment creation failed.');
    }
  } catch (err) {
    // Catch any errors during the payment creation process
    res.status(500).send('Error: ' + err.message);
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


