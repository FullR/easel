const arrayRemove = require("../util/array-remove");

module.exports = class Room {
  constructor(io, roomId) {
    this.io = io;
    this.roomId = roomId;
    this.users = [];
    this.strokes = [];
  }

  isEmpty() {
    return this.users.length === 0;
  }

  broadcast(key, data, avoidUser) {
    if(avoidUser) {
      avoidUser.socket.broadcast.to(this.roomId).emit(key, data);
    } else {
      this.io.sockets.in(this.roomId).emit(key, data);
    }
  }

  addUser(user) {
    const {socket} = user;
    socket.join(this.roomId);
    this.users.push(user);

    socket.on("stroke", (stroke) => this.addStroke(user, stroke));
    this.broadcast("join", user.info, user);

    user.socket.emit("strokes", this.strokes);
  }

  removeUser(user) {
    user.socket.leave(this.roomId);
    arrayRemove(this.users, user);
    this.broadcast("leave", user.id, user);
  }

  addStroke(user, stroke) {
    if(!stroke || !stroke.segments || !stroke.segments.length) return;
    this.strokes.push(stroke);
    this.broadcast("stroke", stroke, user);
  }
}
