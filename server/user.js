
module.exports = class User {
  constructor(socket, info={}) {
    this.id = socket.id;
    this.socket = socket;
    this.info = Object.assign({}, info, {id: this.id});
  }
}
