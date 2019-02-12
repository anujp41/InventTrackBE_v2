const Sequelize = require('sequelize');

let db = null;

if (process.env.NODE_ENV === 'development') {
  db = new Sequelize('postgres://localhost:5432/aws-test', {
    logging: false
  });
} else {
  db = new Sequelize(process.env.DATABASE_URL);
}

module.exports = db;
