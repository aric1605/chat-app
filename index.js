const express = require("express");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const PORT = 8000;

app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});


let messages = [];
let messageId = 0; 

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);


  socket.on("get missed messages", (lastSeenId) => {
    const missedMessages = messages.filter(
      (msg) => msg.id > lastSeenId
    );
    socket.emit("missed messages", missedMessages);
  });

  socket.on("chat message", (text) => {
    const msg = {
      id: ++messageId,
      text
    };

    messages.push(msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("Server started on PORT:", PORT);
});
