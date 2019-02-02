const router = require('express').Router();
const fruitRouter = require('./fruitRouter');

router.use('/fruit', fruitRouter);

module.exports = router;
