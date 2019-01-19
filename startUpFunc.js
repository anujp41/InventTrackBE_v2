/**
 * On starting node server, populates redis cache with remaining fruits
 * @function onStartUp
 */

const { Fruit, UserFruit } = require('./model');
const { addToSortedSet, getSortedSet } = require('./redis');

const onStartUp = () => {
  Fruit.findAll({ attributes: ['id', 'count'] }).then(async fruits => {
    const totalClaimed = {}; //object to store sum of all fruits claimed
    await UserFruit.findAll().then(userFruit => {
      userFruit.forEach(claimedFruit => {
        const id = claimedFruit.fruitId;
        const claimCount = claimedFruit.count;
        totalClaimed[id]
          ? (totalClaimed[id] += claimCount)
          : (totalClaimed[id] = claimCount);
      });
    });
    await fruits.map(fruit => {
      const remainder = fruit.count - totalClaimed[fruit.id];
      addToSortedSet(fruit.id, remainder);
    });
  });
};

module.exports = onStartUp;
