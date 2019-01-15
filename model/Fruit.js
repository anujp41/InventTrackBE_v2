const Sequelize = require('sequelize');
const db = require('../db');

const Fruit = db.define(
  'fruit',
  {
    fruit: { type: Sequelize.STRING, unique: true },
    count: Sequelize.INTEGER
  },
  { timestamps: false }
);

module.exports = Fruit;