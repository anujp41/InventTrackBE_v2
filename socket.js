const controllerOps = require('./controller');

module.exports = async function(socket, io) {
  // console.log('connected ', socket);
  /* 
  EXAMPLE OF OPERATIONS THAT CAN BE PERFORMED ON SOCKETS
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  console.log('the clients are ', Object.keys(io.sockets.sockets));
  console.log('the id is ', socket.id);
  socket.emit('news', await controllerOps.getAll());
  socket.on('disconnect', function() {
    console.log('disconnected', socket.id);
  });
  */
};
