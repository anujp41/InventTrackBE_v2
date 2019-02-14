const router = require('express').Router();
const { userControllers, fruitControllers } = require('../controllers');

router.get('/', (req, res) => {
  userControllers.getAllUsers().then(users => res.json(users));
});

router.get('/all', (req, res) => {
  userControllers.gettingAllUser().then(users => res.json(users));
});

router.put('/', (req, res) => {
  const ioObj = req.app.get('socketIo');
  userControllers
    .updateFruit(req.body)
    .then(response => {
      res.send(response === 'All taken' ? 'Gone' : 'Done');
    })
    .then(async () =>
      ioObj.emit('remainder', await fruitControllers.getAllRemainder())
    );
});

router.get('/:id', (req, res) => {
  const {
    params: { id }
  } = req;
  userControllers.getById(id).then(user => res.json(user));
});

module.exports = router;
