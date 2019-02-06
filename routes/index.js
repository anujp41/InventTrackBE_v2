const router = require('express').Router();
const fruitRouter = require('./fruitRouter');
const userRouter = require('./userRouter');

router.use('/fruit', fruitRouter);
router.use('/user', userRouter);

module.exports = router;
