const router = require('express').Router();
const { FruitCount } = require('./model');

const getAllFruits = () => FruitCount.findAll({ order: [['id', 'ASC']] });
const getById = id => FruitCount.findById(id);
const returnAllFruits = res => getAllFruits().then(fruits => res.json(fruits));

router.get('/', (req, res, next) => {
  returnAllFruits(res).catch(err => next(err));
});

router.get('/add/:id', (req, res, next) => {
  getById(req.params.id)
    .then(fruit => fruit.increment('count', { by: 1 }))
    .then(() => returnAllFruits(res))
    .catch(err => next(err));
});

router.get('/subtract/:id', (req, res, next) => {
  getById(req.params.id)
    .then(fruit => fruit.decrement('count', { by: 1 }))
    .then(() => returnAllFruits(res))
    .catch(err => next(err));
});

router.post('/name/:id', (req, res, next) => {
  FruitCount.update({ fruit: req.body.name }, { where: { id: req.params.id } })
    .then(() => returnAllFruits(res))
    .catch(err => next(err));
});

module.exports = router;
