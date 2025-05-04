const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("✅ Server is working!");
});

app.get("/pay", (req, res) => {
  res.send("🚀 Payment route is working!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
