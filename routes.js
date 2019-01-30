const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const router = require('express').Router();
const controllers = require('./controller');

//Return all fruits
/** Gets current data from redis and get additional detail on each from SQL */
router.get('/', (req, res, next) => {
  controllers.getAllFruits().then(response => res.json(response));
});

//Increase count for selected fruit
router.get('/add/:id', (req, res, next) => {
  controllers
    .getById(req.params.id)
    .then(fruit => fruit.increment('count', { by: 1 }))
    .then(() => controllers.getAllFruits(res))
    .catch(next);
});

//Decrease count for selected fruit
router.get('/subtract/:id', (req, res, next) => {
  controllers
    .getById(req.params.id)
    .then(fruit => fruit.decrement('count', { by: 1 }))
    .then(() => controllers.getAllFruits(res))
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
