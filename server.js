require('dotenv').config();
const express = require('express');
const path = require('path');
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
// const seed = require('./seed');
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
  console.log('here ', path.join(__dirname, './public/index.html'));
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.use(function(err, req, res, next) {
  console.log('Oh no, an error! ', err.stack);
  res.status(404).json({ error: 'Request failed!' });
});

const { Fruit, User, UserFruit } = require('./model/index');
const UserSeed = require('./seed/User');
const FruitSeed = require('./seed/Fruit');
const UserFruitSeed = require('./seed/UserFruit');

db.sync({ force: true })
  .then(() => User.bulkCreate(UserSeed))
  .then(() => Fruit.bulkCreate(FruitSeed))
  .then(() => UserFruit.bulkCreate(UserFruitSeed))
  .then(() => {
    console.log(`SERVER LISTENING ON ${PORT}`);
    onStartUp();
    console.log('Database refreshed!');
  });

/*
db.sync({ force: true })
  .then(async () => await seed(false))
  .then(() => {
    console.log(`SERVER LISTENING ON ${PORT}`);
    onStartUp(); //after db is synced, run onStartUp function that populates redis cache
    console.log('Database refreshed!');
  });
*/
