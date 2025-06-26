const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

const rooms = {};

io.on("connection", socket => {
  console.log("User connected:", socket.id);

  // Join or create a room with password
  socket.on("join-room", ({ roomId, password }) => {
    if (!rooms[roomId]) {
      // Create new room
      rooms[roomId] = {
        players: {},
        password: password
      };
      socket.join(roomId);
      rooms[roomId].players[socket.id] = null;
      console.log(`Room ${roomId} created by ${socket.id}`);
    } else {
      // Existing room: check password
      if (rooms[roomId].password !== password) {
        socket.emit("errorMessage", "Incorrect password");
        return;
      }

      if (Object.keys(rooms[roomId].players).length >= 2) {
        socket.emit("errorMessage", "Room is full");
        return;
      }

      socket.join(roomId);
      rooms[roomId].players[socket.id] = null;
      console.log(`User ${socket.id} joined room ${roomId}`);
    }

    // Start game when two players have joined
    if (Object.keys(rooms[roomId].players).length === 2) {
      io.to(roomId).emit("start-game");
    }
  });

  // Handle player choice
  socket.on("submit-choice", ({ roomId, choice }) => {
    if (!rooms[roomId]) return;
    rooms[roomId].players[socket.id] = choice;

    const players = Object.keys(rooms[roomId].players);
    const choices = Object.values(rooms[roomId].players);

    if (choices.every(c => c)) {
      const result = getResult(...choices);
      io.to(roomId).emit("round-result", {
        choices: {
          [players[0]]: choices[0],
          [players[1]]: choices[1]
        },
        result
      });

      // Reset choices for next round
      rooms[roomId].players[players[0]] = null;
      rooms[roomId].players[players[1]] = null;
    }
  });

  // Handle player disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const roomId in rooms) {
      if (rooms[roomId].players && rooms[roomId].players[socket.id] !== undefined) {
        delete rooms[roomId].players[socket.id];
        io.to(roomId).emit("player-left");

        // Clean up empty room
        if (Object.keys(rooms[roomId].players).length === 0) {
          delete rooms[roomId];
        }
      }
    }
  });
});

// Game logic
function getResult(p1, p2) {
  if (p1 === p2) return "Draw";
  if (
    (p1 === "stone" && p2 === "scissor") ||
    (p1 === "paper" && p2 === "stone") ||
    (p1 === "scissor" && p2 === "paper")
  ) return "Player 1 Wins";
  return "Player 2 Wins";
}

server.listen(3000, () => console.log("Server running at http://localhost:3000"));
