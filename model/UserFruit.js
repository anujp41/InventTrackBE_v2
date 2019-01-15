const Sequelize = require('sequelize');
const db = require('../db');

const UserFruit = db.define(
  'UserFruit',
  {
    count: {
      type: Sequelize.INTEGER,
      validate: { min: 0 }
    }
  },
  { timestamps: false }
);

module.exports = UserFruit;
