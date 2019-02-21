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
  userControllers.updateFruit(req.body).then(async response => {
    res.send(response.message === 'All taken' ? 'Gone' : 'Done');
    ioObj
      .emit('remainder', await fruitControllers.getAllRemainder())
      .emit('newCount', response.updateCount);
  });
});

router.get('/:id', (req, res) => {
  const {
    params: { id }
  } = req;
  userControllers.getById(id).then(user => res.json(user));
});

//Add new user
router.post('/', (req, res, next) => {
  userControllers
    .saveUser(req.body)
    .then(({ user, created }) => {
      if (!created) return res.json({ msg: 'exists' });
    })
    .catch(next);
});

module.exports = router;
