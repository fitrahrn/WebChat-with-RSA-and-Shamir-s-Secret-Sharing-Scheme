const User = require('./User');
const {decryptRSA,decryptRSAKey} = require('../algorithm/RSA.js')
const {generateShares,constructSecret} = require('../algorithm/Shamir.js')
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
      let privateKey;
      let size = 0;
      User.users.forEach((key) => {
        if (key.fullname == user) {
          privateKey = key.privateKey;
        }
        size++;
      });
      let keyPartD = decryptRSAKey(message.keyD[0],privateKey) + decryptRSAKey(message.keyD[1],privateKey)
      let keyPartN = decryptRSAKey(message.keyN[0],privateKey) + decryptRSAKey(message.keyN[1],privateKey)
      console.log("encrypted: "+message.text)
      let checkPrivateKey = {
        d : keyPartD,
        n : keyPartN
      }
      console.log(checkPrivateKey)
      console.log("decrypted: "+ decryptRSA(message.text,checkPrivateKey))
      let {shares,p} = generateShares(BigInt(keyPartD),BigInt(size),BigInt(size-1))
      let i=0;
      
      User.users.forEach((key) => {
        if(key.fullname !==""){
          socket.broadcast.emit('shares '+ key.fullname,{
            user: message.user,
            share: shares[i].n,
            text:message.text,
            t:shares[i].t,
            n:keyPartN,
            p:p.toString(),
            min: size-1
          });
        }
        i++
      });
    });



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