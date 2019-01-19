const Sequelize = require('sequelize');
const { Op, fn, col } = require('sequelize');
const router = require('express').Router();
const { Fruit, UserFruit } = require('./model');
const { addToSortedSet, getSortedSet } = require('./redis');

const getAllFruits = () => Fruit.findAll({ order: [['id', 'ASC']] });
const getById = id => Fruit.findByPk(id);
const returnAllFruits = res => getAllFruits().then(fruits => res.json(fruits));

//Return all fruits
/** Gets current data from redis and get additional detail on each from SQL */
router.get('/', (req, res, next) => {
  req.app.get('socketIo').emit('news', 'Hola Hermano!');
  getSortedSet().then(async resArray => {
    const response = {};
    let currKey = null;
    for (let i = 0; i < resArray.length; i++) {
      if (i % 2) {
        response[currKey].remainder = parseInt(resArray[i]);
      } else {
        const id = resArray[i].slice(resArray[i].indexOf(':') + 1);
        const fruitDetail = await getById(id);
        currKey = `fruit:${id}`;
        response[currKey] = fruitDetail;
      }
    }
    res.json(response);
  });
});

//Increase count for selected fruit
router.get('/add/:id', (req, res, next) => {
  getById(req.params.id)
    .then(fruit => fruit.increment('count', { by: 1 }))
    .then(() => {
      return returnAllFruits(res);
    })
    .catch(next);
});

//Decrease count for selected fruit
router.get('/subtract/:id', (req, res, next) => {
  getById(req.params.id)
    .then(fruit => fruit.decrement('count', { by: 1 }))
    .then(() => returnAllFruits(res))
    .catch(next);
});

//Remove selected fruit
router.get('/remove/:id', (req, res, next) => {
  Fruit.destroy({ where: { id: { [Op.eq]: req.params.id } } })
    .then(() => returnAllFruits(res))
    .catch(next);
});

//Update name for selected fruit
router.post('/name/:id', (req, res, next) => {
  Fruit.update(
    { fruit: req.body.name },
    { where: { id: { [Op.eq]: req.params.id } } }
  )
    .then(() => returnAllFruits(res))
    .catch(next);
});

//Add new fruit
router.post('/fruit', (req, res, next) => {
  Fruit.create(req.body)
    .then(() => returnAllFruits(res))
    .catch(next);
});

module.exports = router;
