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
  fruitControllers
    .getById(req.params.id)
    .then(async fruit => {
      await fruitControllers.updateCount(req.params.id);
      return await fruit.increment('count', { by: 1 });
    })
    .then(async responseData => {
      const response = responseData.get({ plain: true });
      const resObj = {
        socketId: currClient,
        response
      };
      ioObj
        .emit('updatedCount', resObj)
        .emit('remainder', await fruitControllers.getAllRemainder());
      res.send(200);
    })
    .catch(next);
});

//Decrease count for selected fruit
router.get('/subtract/:id', (req, res, next) => {
  const ioObj = req.app.get('socketIo'); //io object from app
  const currClient = req.headers.socket; //socket id who sent the curr request
  fruitControllers
    .getById(req.params.id)
    .then(async fruit => {
      fruitControllers.updateCount(req.params.id, 'subtract');
      return await fruit.decrement('count', { by: 1 });
    })
    .then(async responseData => {
      const response = responseData.get({ plain: true });
      const resObj = {
        socketId: currClient,
        response
      };
      ioObj
        .emit('updatedCount', resObj)
        .emit('remainder', await fruitControllers.getAllRemainder());
      res.send(200);
    })
    .catch(next);
});

//Remove selected fruit
router.get('/remove/:id', (req, res, next) => {
  const ioObj = req.app.get('socketIo');
  // Fruit.destroy({ where: { id: { [Op.eq]: req.params.id } } })
  fruitControllers
    .removeFruit(req.params.id)
    .then(() => {
      ioObj.emit('fruit-delete', req.params.id);
      res.sendStatus(200);
    })
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
router.post('/', (req, res, next) => {
  const ioObj = req.app.get('socketIo');
  fruitControllers
    .saveFruit(req.body)
    .then(({ fruit, created }) => {
      if (!created) return res.json({ msg: 'exists' });
      ioObj.emit('updateThis');
    })
    .catch(next);
});

module.exports = router;
