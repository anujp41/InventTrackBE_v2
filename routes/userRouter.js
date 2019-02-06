const router = require('express').Router();
const { userControllers } = require('../controllers');

router.get('/', (req, res) => {
  console.log('i am here!');
  userControllers.getAllUsers().then(users => res.json(users));
});

router.get('/:id', (req, res) => {
  const {
    params: { id }
  } = req;
  userControllers.getById(id).then(user => res.json(user));
});

router.get('/find/:id', (req, res) => {
  const {
    params: { id }
  } = req;
  userControllers.findById(id).then(user => res.json(user));
});

module.exports = router;
