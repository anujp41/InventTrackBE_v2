const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define(
  'user',
  {
    name: { type: Sequelize.STRING, unique: true }
  },
  { timestamps: false }
);

module.exports = User;
