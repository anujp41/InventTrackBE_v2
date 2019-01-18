const Sequelize = require('sequelize');
const { Op, fn, col } = require('sequelize');
const router = require('express').Router();
const { Fruit, UserFruit } = require('./model');
const { addToSortedSet, getSortedSet } = require('./redis');

const getAllFruits = () => Fruit.findAll({ order: [['id', 'ASC']] });
const getById = id => Fruit.findByPk(id);
const returnAllFruits = res => getAllFruits().then(fruits => res.json(fruits));

//Return all fruits
router.get('/', (req, res, next) => {
  req.app.get('socketIo').emit('news', 'Hola Hermano!');
  returnAllFruits(res).catch(next);
});

//Return unclaimed fruits
router.get('/remainder', (req, res, next) => {
  Fruit.findAll({ attributes: ['id', 'count'] }).then(async fruits => {
    const totalClaimed = {}; //object to store sum of all fruits claimed

    await UserFruit.findAll().then(userFruit => {
      userFruit.forEach(claimedFruit => {
        const id = claimedFruit.fruitId;
        const claimCount = claimedFruit.count;
        totalClaimed[id]
          ? (totalClaimed[id] += claimCount)
          : (totalClaimed[id] = claimCount);
      });
    });
    const totalRemaining = await fruits.map(fruit => {
      const remainder = fruit.count - totalClaimed[fruit.id];
      addToSortedSet(fruit.id, remainder); //.then(() => ({
      //   id: fruit.id,
      //   remainder
      // }));
      return { id: fruit.id, remainder };
    });
    console.log('totalRemaining ', totalRemaining);
    getSortedSet();
    res.json(totalRemaining);
  });
});

//Sum of total claimed frutis
// router.get('/claimed', (req, res, next) => {
//   UserFruit.findAll({
//     attributes: [Sequelize.fn('count', Sequelize.col('UserFruit.count'))],
//     group: ['UserFruit.fruitId']
//   }).then(fruit => res.json(fruit));
// });

//Increase count for selected fruit
router.get('/add/:id', (req, res, next) => {
  // const socketIo = req.app.get('socketIo');
  // console.log('socketIo: ', socketIo);
  getById(req.params.id)
    .then(fruit => fruit.increment('count', { by: 1 }))
    .then(() => {
      socketIo.emit('news', 'adding fruit');
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
