/**
 * On starting node server, populates redis cache with remaining fruits
 * @function onStartUp
 */
const Sequelize = require('sequelize');
const { Fruit, UserFruit } = require('./model');
const { addToSortedSet, addToHash } = require('./redis');

const getRemainder = (arr, obj) => {
  for (let arrPointer = 0; arrPointer < arr.length; arrPointer++) {
    const item = arr[arrPointer];
    const key = item.id;
    if (obj[key] && obj[key] > 0) {
      item.remainder -= obj[key];
    }
  }
  return arr;
};

const onStartUp = async () => {
  const allFruits = await Fruit.findAll({
    attributes: ['id', 'name', 'count', ['count', 'remainder']], //including count twice as remainder to make it easy to calculate later
    raw: true,
    order: [['id', 'ASC']]
  });
  const totalClaimed = await UserFruit.findAll({
    attributes: [
      ['fruitId', 'id'], //renames fruitId from sql in id so easy to process
      Sequelize.fn('sum', Sequelize.col('counter'))
    ],
    group: ['fruitId'],
    raw: true
  }).then(claimedFruits => {
    const claimedFruitsObj = {};
    claimedFruits.forEach(fruit => {
      claimedFruitsObj[fruit.id] = fruit.sum;
    });
    return claimedFruitsObj;
  });
  const remainderFruit = getRemainder(allFruits, totalClaimed);
  remainderFruit.forEach(async fruit => {
    const { id, name, count, remainder } = fruit;
    await addToHash(id, name, count);
    await addToSortedSet(id, remainder);
  });
  return 'redis done!';
};

module.exports = onStartUp;
