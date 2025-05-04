const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// This is a simple route for testing purposes
app.get('/', (req, res) => {
  res.send('PayDunya Node.js App');
});

// Make the app listen on the given port
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
