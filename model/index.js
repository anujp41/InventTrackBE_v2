const db = require('../db');
const Fruit = require('./Fruit');
const User = require('./User');
const UserFruit = require('./UserFruit');

Fruit.belongsToMany(User, {
  as: 'Owner',
  through: UserFruit
});
User.belongsToMany(Fruit, {
  as: 'Consumer',
  through: UserFruit
});

module.exports = { db, Fruit, User, UserFruit };
