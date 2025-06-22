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

  socket.on("join-room", roomId => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = {};
    rooms[roomId][socket.id] = null;

    console.log(`User ${socket.id} joined room ${roomId}`);

    if (Object.keys(rooms[roomId]).length === 2) {
      io.to(roomId).emit("start-game");
    }
  });

  socket.on("submit-choice", ({ roomId, choice }) => {
    if (!rooms[roomId]) return;
    rooms[roomId][socket.id] = choice;

    const players = Object.keys(rooms[roomId]);
    const choices = Object.values(rooms[roomId]);

    if (choices.every(c => c)) {
      const result = getResult(...choices);
      io.to(roomId).emit("round-result", {
        choices: {
          [players[0]]: choices[0],
          [players[1]]: choices[1]
        },
        result
      });
      // Reset for next round
      rooms[roomId][players[0]] = null;
      rooms[roomId][players[1]] = null;
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    for (const roomId in rooms) {
      if (rooms[roomId][socket.id] !== undefined) {
        delete rooms[roomId][socket.id];
        io.to(roomId).emit("player-left");
      }
    }
  });
});

function getResult(p1, p2) {
  if (p1 === p2) return "Draw";
  if ((p1 === "stone" && p2 === "scissor") ||
      (p1 === "paper" && p2 === "stone") ||
      (p1 === "scissor" && p2 === "paper")) return "Player 1 Wins";
  return "Player 2 Wins";
}

server.listen(3000, () => console.log("Server running at http://localhost:3000"));
