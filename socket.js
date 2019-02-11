const { fruitControllers } = require('./controllers');
const { client } = require('./redis');

module.exports = function(socket, io) {
  // console.log('connected ', socket);
  // EXAMPLE OF OPERATIONS THAT CAN BE PERFORMED ON SOCKETS
  // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  // console.log(io.sockets);
  // console.log('the clients are ', Object.keys(io.sockets.sockets));
  // console.log('the id is ', socket.id);
  // socket.emit('news', await controllerOps.getAll());
  // socket.on('disconnect', function() {
  //   console.log('disconnected', socket.id);
  // });
  socket.on('getData', async data => {
    console.log(`${socket.id} requested remaining fruits!`);
    socket.emit('remainder', await fruitControllers.getAllRemainder());
  });
};
