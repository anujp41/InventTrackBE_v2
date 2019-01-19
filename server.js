require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 8000;
const app = express();
const socketIo = require('socket.io');
const routes = require('./routes');
const cors = require('cors');
const middleware = require('./middleware');
const server = app.listen(PORT);
const io = socketIo(server);
const db = require('./db');
app.set('socketIo', io);
const onStartUp = require('./startUpFunc');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/data', middleware, routes);

app.use(function(err, req, res, next) {
  console.log('Oh no, an error! ', err.stack);
  res.status(404).json({ error: 'Request failed!' });
});

db.sync().then(() => {
  onStartUp(); //after db is synced, run onStartUp function that populates redis cache
  console.log('Database refreshed!');
});
