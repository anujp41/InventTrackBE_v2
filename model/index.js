const db = require('../db');
const Fruit = require('./Fruit');
const User = require('./User');
const UserFruit = require('./UserFruit');

Fruit.belongsToMany(User, { through: UserFruit });
User.belongsToMany(Fruit, { through: UserFruit });

module.exports = { db, Fruit, User, UserFruit };
