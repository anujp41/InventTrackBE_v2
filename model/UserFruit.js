const Sequelize = require('sequelize');
const db = require('../db');

const UserFruit = db.define(
  'UserFruit',
  {
    counter: {
      type: Sequelize.INTEGER,
      validate: { min: 0 }
    }
  },
  { timestamps: false }
);

module.exports = UserFruit;
