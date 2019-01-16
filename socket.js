const socketIo = require('socket.io');

module.exports = function(server) {
  const io = socketIo(server);
  io.on('connection', function(socket) {
    console.log('id ', socket.id);
    socket.emit('news', { hello: 'world' });
    socket.on('browser', console.log);
  });
};
