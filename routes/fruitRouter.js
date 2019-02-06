const { Op } = require('sequelize');
const router = require('express').Router();
const { fruitControllers } = require('../controllers');

//Return all fruits
/** Gets current data from redis and get additional detail on each from SQL */
router.get('/', (req, res, next) => {
  fruitControllers.getAllFruits().then(response => {
    const resObj = response.reduce((aggregate, item) => {
      aggregate[item.id] = item;
      return aggregate;
    }, {});
    res.json(resObj);
  });
});

//Increase count for selected fruit
router.get('/add/:id', (req, res, next) => {
  const ioObj = req.app.get('socketIo'); //io object from app
  const currClient = req.headers.socket; //socket id who sent the curr request
  const allClients = Object.keys(ioObj.sockets.sockets);
  fruitControllers
    .getById(req.params.id)
    .then(fruit => fruit.increment('count', { by: 1 }))
    .then(responseData => {
      allClients.forEach(client => {
        client === currClient
          ? res.json(responseData)
          : ioObj.to(client).emit('updatedCount', responseData);
      });
    })
    .catch(next);
});

//Decrease count for selected fruit
router.get('/subtract/:id', (req, res, next) => {
  const ioObj = req.app.get('socketIo'); //io object from app
  const currClient = req.headers.socket; //socket id who sent the curr request
  const allClients = Object.keys(ioObj.sockets.sockets);
  fruitControllers
    .getById(req.params.id)
    .then(fruit => fruit.decrement('count', { by: 1 }))
    .then(responseData => {
      allClients.forEach(client => {
        client === currClient
          ? res.json(responseData)
          : ioObj.to(client).emit('updatedCount', responseData);
      });
    })
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
