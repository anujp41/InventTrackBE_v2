const { db, Fruit, User, UserFruit } = require('../model/index');
const UserSeed = require('./User');
const FruitSeed = require('./Fruit');
const UserFruitSeed = require('./UserFruit');
console.log('here ', process.env);
const seed = () => {
  console.log('Seeding database!');
  db.sync({ force: true })
    .then(() => User.bulkCreate(UserSeed))
    .then(() => Fruit.bulkCreate(FruitSeed))
    .then(() => UserFruit.bulkCreate(UserFruitSeed))
    .then(() => {
      console.log('Seeding complete!');
      db.close();
    });
};
seed();
