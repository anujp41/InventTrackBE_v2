require('dotenv').config();
// const http = require('http');
const express = require('express');
const PORT = process.env.PORT || 8000;
const app = express();
// const server = http.Server(app);
const socketIo = require('socket.io');
const routes = require('./routes');
const cors = require('cors');
const middleware = require('./middleware');
const server = app.listen(PORT);
const io = socketIo(server);
const db = require('./db');
app.set('socketIo', io);

// const db = require('./db');
// const { User, Fruit, UserFruit } = require('./model');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// io.on('connection', socket => app.set('socketIo', socket));

// app.use(function(req, res, next) {
//   req.io = io;
//   next();
// });

// io.on('connection', socket => console.log('connected ', socket.id));

app.use('/data', middleware, routes);

app.use(function(err, req, res, next) {
  console.log('Oh no, an error! ', err.stack);
  res.status(404).json({ error: 'Request failed!' });
});

db.sync({ force: true }).then(() => console.log('Database refreshed!'));

// server.listen(PORT, () => {
//   console.log(`Server listening on PORT ${PORT}`);
//   if (process.env.NODE_ENV === 'development') {
//     db.sync()
//       .then(() =>
//         console.log('Database is working & has previously seeded data!')
//       )
//       .catch(err => console.log('Trouble in db-land', err));
//   } else {
//     db.sync()
//       .then(() => User.destroy({ where: {} }))
//       .then(() =>
//         User.bulkCreate([
//           { fruit: 'Apple', count: 10 },
//           { fruit: 'Pineapple', count: 8 }
//         ])
//       )
//       .then(() => console.log('Database created and table seeded!'))
//       .catch(err => console.log('Trouble in db-land', err));
//   }
// });
