const Sequelize = require('sequelize');
const db = require('./db');

const FruitCount = db.define(
  'fruit-count',
  {
    fruit: { type: Sequelize.STRING, unique: true },
    count: Sequelize.INTEGER
  },
  { timestamps: false }
);

module.exports = { db, FruitCount };
