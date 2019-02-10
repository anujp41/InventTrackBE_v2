const router = require('express').Router();
const { userControllers } = require('../controllers');

router.get('/', (req, res) => {
  userControllers.getAllUsers().then(users => res.json(users));
});

router.put('/', (req, res) => {
  userControllers.updateFruit(req.body).then(response => {
    console.log('response is ', response);
    res.send(response === 'All taken' ? 400 : 200);
  });
});

router.get('/:id', (req, res) => {
  const {
    params: { id }
  } = req;
  userControllers.getById(id).then(user => res.json(user));
});

module.exports = router;
