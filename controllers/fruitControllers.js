const { Op } = require('sequelize');
const { db, Fruit, User, UserFruit } = require('../model');
const {
  getZScore,
  addToSortedSet,
  getSortedSet,
  getFromHash,
  incSortedSet
} = require('../redis');

module.exports = {
  getAllFruits() {
    return Fruit.findAll({ order: [['id', 'ASC']], raw: true });
  },
  getById(id) {
    return Fruit.findByPk(id);
  },
  updateCount(id, toDo = 'add') {
    return incSortedSet(id, toDo === 'add' ? 1 : -1);
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
  },
  removeFruit(id) {
    return Fruit.destroy({ where: { id: { [Op.eq]: id } } });
  },
  saveFruit(newFruit) {
    const { name } = newFruit;
    return Fruit.findOrCreate({
      where: { name: { [Op.iLike]: name } },
      defaults: newFruit
    }).spread((fruit, created) => ({
      fruit: fruit.get({ plain: true }),
      created
    }));
  }
};
