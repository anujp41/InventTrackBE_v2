const router = require('express').Router();
const { Fruit } = require('./model');

const getAllFruits = () => Fruit.findAll({ order: [['id', 'ASC']] });
const getById = id => Fruit.findById(id);
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
  Fruit.update({ fruit: req.body.name }, { where: { id: req.params.id } })
    .then(() => returnAllFruits(res))
    .catch(err => next(err));
});

router.post('/fruit', (req, res, next) => {
  Fruit.create(req.body)
    .then(() => returnAllFruits(res))
    .catch(next);
});

module.exports = router;
