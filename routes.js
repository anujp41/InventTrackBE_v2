const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const router = require('express').Router();
const { db, Fruit, User, UserFruit } = require('./model');
const { addToSortedSet, getSortedSet } = require('./redis');

const getAllFruits = () => Fruit.findAll({ order: [['id', 'ASC']] });
const getById = id => Fruit.findByPk(id);
const returnAllFruits = res => getAllFruits().then(fruits => res.json(fruits));

/////TEST
router.get('/fruitData', (req, res, next) => {
  console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
  UserFruit.findAll({
    attributes: ['fruitId', Sequelize.fn('sum', Sequelize.col('counter'))],
    group: ['fruitId'],
    raw: true
  })
    .then(fruits => res.json(fruits))
    .catch(next);
  // Fruit.findAll({
  //   attributes: ['name', Sequelize.fn('SUM', Sequelize.col('id'))],
  //   group: ['name'],
  //   raw: true
  // })
  //   .then(fruits => {
  //     console.log('here are ', fruits);
  //     res.json(fruits);
  //   })
  //   .catch(next);
});

// router.get('/allData', (req, res, next) => {
//   UserFruit.findAll({
//     include: {
//       model: User,
//       as: 'Owner'
//     }
//   }).then(allData => res.json(allData));
// });

// router.get('/allData', (req, res, next) => {
//   Fruit.findAll({
//     include: {
//       model: User,
//       through: {
//         model: UserFruit
//       }
//     }
//   }).then(allData => res.json(allData));
// });

//Return all fruits
/** Gets current data from redis and get additional detail on each from SQL */
router.get('/', (req, res, next) => {
  const io = req.app.get('socketIo');
  // console.log('clients ', io.clients());
  // io.clients((error, clients) => {
  //   if (error) throw error;
  //   clients.emit();
  //   console.log('clients: ', clients);
  // });
  io.emit('news', 'Hola Hermano!');
  getSortedSet().then(async resArray => {
    console.log('the resArray ', resArray);
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
