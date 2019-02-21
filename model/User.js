const Sequelize = require('sequelize');
const db = require('../db');

const capitalizeThis = word => word[0].toUpperCase() + word.slice(1);

const User = db.define(
  'user',
  {
    name: { type: Sequelize.STRING, unique: true }
  },
  {
    timestamps: false,
    hooks: {
      beforeCreate: (fruit, options) => {
        const currName = fruit.name;
        const capName = currName.includes(' ')
          ? currName
              .split(' ')
              .map(capitalizeThis)
              .join(' ')
          : capitalizeThis(currName);
        fruit.name = capName;
      }
    }
  }
);

module.exports = User;
