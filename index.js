const express = require("express");
const bodyParser = require("body-parser");
const paydunya = require("paydunya");
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// PayDunya Setup
paydunya.debug(true);
paydunya.setKeys(
  process.env.MASTER_KEY,
  process.env.PRIVATE_KEY,
  process.env.PUBLIC_KEY,
  process.env.TOKEN
);
paydunya.setMode("test"); // or "live"

app.get("/pay", (req, res) => {
  paydunya.Invoice.create({
    invoice: {
      items: [
        {
          name: "Test Product",
          quantity: 1,
          unit_price: 5000,
          total_price: 5000
        }
      ],
      description: "Test payment from PayDunya",
      total_amount: 5000,
    },
    actions: {
      callback_url: "https://your-callback-url.com",
      cancel_url: "https://your-cancel-url.com",
      return_url: "https://your-return-url.com"
    }
  }, function (resp, invoice) {
    if (resp === true) {
      res.redirect(invoice.response.checkout_url);
    } else {
      res.status(500).send("Payment creation failed: " + invoice.response.text);
    }
  });
});

app.get("/", (req, res) => {
  res.send("Hello, PayDunya server is working!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



  
