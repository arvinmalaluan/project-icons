const { server } = require("./../app");
const port = process.env.PORT || 3000;
require("dotenv").config();

server.listen(port, (error) => {
  if (error) {
    console.error("Error starting the server:", error);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});
