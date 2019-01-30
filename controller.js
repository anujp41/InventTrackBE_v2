const { db, Fruit, User, UserFruit } = require('./model');
const { addToSortedSet, getSortedSet, getFromHash } = require('./redis');

module.exports = {
  getAllFruits() {
    return Fruit.findAll({ order: [['id', 'ASC']], raw: true });
  },
  getById(id) {
    return Fruit.findByPk(id);
  },
  getAllRemainder() {
    //gets remainder from redis cache
    return getSortedSet().then(async resArray => {
      const response = {};
      let currKey = null;
      for (let i = 0; i < resArray.length; i++) {
        if (i % 2) {
          response[currKey].remainder = parseInt(resArray[i]);
        } else {
          const id = resArray[i].slice(resArray[i].indexOf(':') + 1);
          const fruitDetail = await getFromHash(id);
          currKey = `fruit:${id}`;
          response[currKey] = fruitDetail;
        }
      }
      return response;
    });
  }
};
