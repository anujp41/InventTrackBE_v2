const router = require('express').Router();
const data = require('./data.json');

router.get('/', (req, res) => {
  res.json(data);
});

router.post('/', (req, res) => {
  data.apples += 1;
  res.json(data);
});

router.delete('/', (req, res) => {
  data.apples -= 1;
  res.json(data);
});

module.exports = router;
