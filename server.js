require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 8000;
const app = express();
const socketIo = require('socket.io');
const routes = require('./routes');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const middleware = require('./middleware');
const server = app.listen(PORT);
const io = socketIo(server);
const db = require('./db');
app.set('socketIo', io);
const onStartUp = require('./startUpFunc');
// require('pg').defaults.parseInt8 = true; //Required for pg library to return as data type that it reads (https://github.com/sequelize/sequelize/issues/2383#issuecomment-58006083)

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

io.on('connection', function(socket) {
  require('./socket')(socket, io);
  // socket.emit('hello', 'ding dong');
});

app.use('/data', middleware, routes);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.use(function(err, req, res, next) {
  console.log('Oh no, an error! ', err.stack);
  res.status(404).json({ error: 'Request failed!' });
});

db.sync().then(() => {
  console.log(`SERVER LISTENING ON ${PORT}`);
  onStartUp(); //after db is synced, run onStartUp function that populates redis cache
  console.log('Database refreshed!');
});
