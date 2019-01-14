const router = require('express').Router();
const { FruitCount } = require('./model');

const getAllFruits = () => FruitCount.findAll({ order: [['id', 'ASC']] });

const returnAllFruits = res => getAllFruits().then(fruits => res.json(fruits));

router.get('/', (req, res, next) => {
  returnAllFruits(res).catch(err => next(err));
});

router.get('/add/:id', (req, res, next) => {
  FruitCount.findById(req.params.id)
    .then(fruit => fruit.increment('count', { by: 1 }))
    .then(() => returnAllFruits(res))
    .catch(err => next(err));
});

router.get('/subtract/:id', (req, res, next) => {
  FruitCount.findById(req.params.id)
    .then(fruit => fruit.decrement('count', { by: 1 }))
    .then(() => returnAllFruits(res))
    .catch(err => next(err));
});

module.exports = router;
