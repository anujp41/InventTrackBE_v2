/**
 * On starting node server, populates redis cache with remaining fruits
 * @function onStartUp
 */
const Sequelize = require('sequelize');
const { Fruit, UserFruit } = require('./model');
const { addToSortedSet, getSortedSet } = require('./redis');

const onStartUp = () => {
  Fruit.findAll({ attributes: ['id', 'count'], raw: true }).then(
    async fruits => {
      // const totalClaimed = {}; //object to store sum of all fruits claimed
      // await UserFruit.findAll().then(userFruit => {
      //   userFruit.forEach(claimedFruit => {
      //     const id = claimedFruit.fruitId;
      //     const claimCount = claimedFruit.counter;
      //     totalClaimed[id]
      //       ? (totalClaimed[id] += claimCount)
      //       : (totalClaimed[id] = claimCount);
      //   });
      // });
      const totalClaimed = await UserFruit.findAll({
        attributes: [
          ['fruitId', 'id'], //renames fruitId from sql in id so easy to process
          Sequelize.fn('sum', Sequelize.col('counter'))
        ],
        group: ['fruitId'],
        raw: true,
        order: [['fruitId', 'ASC']] //returns array with lower id at the top
      });
      console.log('fruits are ', fruits);
      console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
      console.log('total Claimed ', totalClaimed);
      /*
      await fruits.map(fruit => {
        const remainder =
          fruit.count - totalClaimed[fruit.id] ? totalClaimed[fruit.id] : 0;
        // console.log('remainder is ', remainder);
        // addToSortedSet(fruit.id, remainder);
      });
      */
    }
  );
};

module.exports = onStartUp;
