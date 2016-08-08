const log = console.log.bind(console);
const {createReadStream} = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const Room = require("./room");
const User = require("./user");
const port = process.env.PORT || 3000;

app.use("/public", express.static(__dirname + "/../public"));
app.get("*", (req, res) => createReadStream(`${__dirname}/../public/index.html`).pipe(res));

const rooms = {};

function joinRoom(user, roomId) {
  if(!(rooms[roomId] instanceof Room)) {
    rooms[roomId] = new Room(io, roomId);
  }
  rooms[roomId].addUser(user);
}

function leaveRoom(user, roomId) {
  if(rooms[roomId] instanceof Room) {
    rooms[roomId].removeUser(user);
  }
}

function initUserSocket(socket) {
  const user = new User(socket);
  let currentRoomId = null;

  socket.on("join-room", (roomId) => {
    currentRoomId = roomId;
    joinRoom(user, roomId);
    log(`User ${user.id} joined room ${roomId}`);
  });

  socket.on("disconnect", () => {
    if(currentRoomId) {
      leaveRoom(user, currentRoomId);
      log(`User ${user.id} left room ${currentRoomId}`);
    }
  });
}

io.on("connection", initUserSocket);

http.listen(port, () => console.log(`listening on localhost:${port}`));
