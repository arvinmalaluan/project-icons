const { app, wss } = require("./../app"); // Import the Express app and WebSocket server
const http = require("http");
const port = process.env.PORT || 3000;
require("dotenv").config();

const server = http.createServer(app);

// Handle WebSocket upgrade on the same server
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

server.listen(port, (error) => {
  if (error) {
    console.error("Error starting the server:", error);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});
