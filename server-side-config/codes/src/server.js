const { server } = require("./../app");
const port = process.env.PORT || 3000;
require("dotenv").config();
const admin = require("firebase-admin");
const socketIO = require("socket.io");

server.listen(port, (error) => {
  if (error) {
    console.error("Error starting the server:", error);
  } else {
    console.log(`Server is running on http://localhost:${port}`);
  }
});

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const serviceAccount = require("./secretKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://messaging-icons-default-rtdb.asia-southeast1.firebasedatabase.app/",
});

const db = admin.database();
const messagesRef = db.ref("messages");
const convosRef = db.ref("convo");
const roomRef = db.ref("room");

messagesRef.on("value", (snapshot) => {
  console.log("Database connected");
});

convosRef.on("value", (snapshot) => {
  console.log("Database Convo connected");
});

// app.use(bodyParser.json());

// app.post("/messages", async (req, res) => {
//   try {
//     const { sender, room, message } = req.body;
//     if (!sender || !room || !message) {
//       return res
//         .status(400)
//         .json({ error: "Missing sender, room, or message" });
//     }
//     await messagesRef.push({
//       sender,
//       room,
//       message,
//       timestamp: admin.database.ServerValue.TIMESTAMP,
//     });
//     return res.status(201).json({ success: true });
//   } catch (error) {
//     console.error("Error sending message:", error);
//     return res.status(500).json({ error: "Failed to send message" });
//   }
// });

io.on("connection", (socket) => {
  console.log(socket.id, "A user connected");

  socket.on("subscribe-to-room", (room) => {
    messagesRef
      .orderByChild("room")
      .equalTo(room)
      .on("child_added", (snapshot) => {
        const message = snapshot.val();
        io.to(room).emit("chat-message", message);
      });
  });

  socket.on("send-chat-message", async ({ sender, room, message }) => {
    console.log("Received send-chat-message event:", sender, room, message);
    if (sender && room && message) {
      try {
        await messagesRef.push({
          sender,
          room,
          message,
          timestamp: admin.database.ServerValue.TIMESTAMP,
        });
        io.to(room).emit("chat-message", { sender, message });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(socket.id, "A user disconnected");
  });

  socket.on("fetch-room-ids", async (accountId) => {
    console.log("Fetching room IDs for account ID:", accountId);
    try {
        // Convert accountId to integer
        const accountIdInt = parseInt(accountId);

        const accountSnapshot = await convosRef.child(accountIdInt).once("value");
        const roomsSnapshot = accountSnapshot.child("rooms");
        const roomValues = [];
        roomsSnapshot.forEach((childSnapshot) => {
            roomValues.push(childSnapshot.val());
        });

        // Fetch data for each room ID in the array
        roomValues.forEach(async (roomId) => {
            try {
                const roomSnapshot = await roomRef.child(roomId).once("value");
                const roomData = roomSnapshot.val();

                // Extract and log only the values as a single string
                const values = Object.values(roomData).filter(value => value !== accountIdInt);
                const stringValue = values.join(", "); // Convert to a comma-separated string
                console.log("Data for room ID", roomId, ":", stringValue);
                // socket.emit("other-user", stringValue);

                messagesRef
                .orderByChild("room")
                .equalTo(room)
                .limitToLast(1)
                .once("value", (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        const message = childSnapshot.val();
                        io.to(room).emit("chat-message", message);
                    });
                });

            } catch (error) {
                console.error("Error fetching data for room ID", roomId, ":", error);
            }
        });

    } catch (error) {
        console.error("Error fetching room IDs:", error);
    }
});



  
  
});
