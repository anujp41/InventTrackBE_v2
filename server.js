require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 8000;
const app = express();
const routes = require('./routes');
const cors = require('cors');
const middleware = require('./middleware');
const db = require('./db');
const { User, Fruit, UserFruit } = require('./model');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/data', middleware, routes);

app.use(function(err, req, res, next) {
  console.log('Oh no, an error!');
  res.status(404).json({ error: 'Request failed!' });
});

app.listen(PORT, () => {
  console.log(`Server listening on PORT ${PORT}`);
  if (process.env.NODE_ENV === 'development') {
    db.sync()
      .then(() =>
        console.log('Database is working & has previously seeded data!')
      )
      .catch(err => console.log('Trouble in db-land', err));
  } else {
    db.sync()
      .then(() => User.destroy({ where: {} }))
      .then(() =>
        User.bulkCreate([
          { fruit: 'Apple', count: 10 },
          { fruit: 'Pineapple', count: 8 }
        ])
      )
      .then(() => console.log('Database created and table seeded!'))
      .catch(err => console.log('Trouble in db-land', err));
  }
});
