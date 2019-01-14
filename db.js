const Sequelize = require('sequelize');

let db = null;

if (process.env.NODE_ENV === 'development') {
  db = new Sequelize('postgres://localhost:5432/aws-test', {
    logging: false
  });
} else {
  db = new Sequelize(
    process.env.RDS_DB_NAME,
    process.env.RDS_USERNAME,
    process.env.RDS_PASSWORD,
    {
      host: process.env.RDS_HOSTNAME,
      dialect: 'postgres',
      logging: false
    }
  );
}
module.exports = db;
