const { server } = require("./../app");
const express = require('express');
const port = process.env.PORT || 3000;
const cors = require('cors');
const app = express();
require("dotenv").config();


app.use(cors());


server.listen(port, (error) => {
  if (error) {
    console.error("Error starting the server:", error);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});
