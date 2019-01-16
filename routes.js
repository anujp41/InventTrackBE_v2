const { Op } = require('sequelize');
const router = require('express').Router();
const { Fruit } = require('./model');

const getAllFruits = () => Fruit.findAll({ order: [['id', 'ASC']] });
const getById = id => Fruit.findByPk(id);
const returnAllFruits = res => getAllFruits().then(fruits => res.json(fruits));

//Return all fruits
router.get('/', (req, res, next) => {
  returnAllFruits(res).catch(err => next(err));
});

//Increase count for selected fruit
router.get('/add/:id', (req, res, next) => {
  getById(req.params.id)
    .then(fruit => fruit.increment('count', { by: 1 }))
    .then(() => returnAllFruits(res))
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
