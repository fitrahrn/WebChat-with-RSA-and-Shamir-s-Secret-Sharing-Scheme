const User = require('./User');
import {decryptRSA} from '../algorithm/RSA.js';
module.exports = (io) => {

  // Connection
  io.on('connection', (socket) => {

    // Send online user list
    socket.emit('get online user', User.getOnlineUser());

    let connectedUser = new User(socket.id, false);
    User.users.set(socket.id, connectedUser);

    // Login
    socket.on('login', (fullName,privateKey) => {

      // Check user
      let isUsing = false;
      User.users.forEach((key) => {
        if (key.fullname == fullName) {
          isUsing = true;
        }
      });
      socket.emit('check user', isUsing);

      // Add User
      if (User.users.has(socket.id) && !isUsing) {
        let currentUser = User.users.get(socket.id);
        currentUser.isLogin = true;
        currentUser.fullname = fullName;
        currentUser.privateKey.d = privateKey.d;
        currentUser.privateKey.n = privateKey.n;
        io.emit('new user', fullName);
      }

    });

    // Send message
    socket.on('send message', (message) => {
      socket.broadcast.emit('new message', message);
    });
    socket.on('send encrypted', (message) => {
      let user = message.user;
      let publicKey = 0n;
      User.users.forEach((key) => {
        if (key.fullname == user) {
          publicKey = key.publicKey;
        }
      });
      let decrypted = decryptRSA(message)
      socket.broadcast.emit('new message', message);
    });
    // socket.on('send key', (message) => {
    //   socket.broadcast.emit('new key', message);
    // });



    // Disconnect
    socket.on('disconnect', (reason) => {

      let currentUser = User.users.get(socket.id);
      if (currentUser.isLogin) {
        io.emit('exit user', currentUser.fullname);
      }

      User.users.delete(socket.id);
      // Send new online user list to all online user
      io.emit('get online user', User.getOnlineUser());
    });

  });
}