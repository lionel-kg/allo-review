const express = require('express');
const router = express.Router();
const userRouter = require('./user.route');
const codeRouter = require('./code.route');
const subscriptionRouter = require('./subscription.route');
const movieRouter = require('./movie.route');
const reviewRouter = require('./review.route');
const genreRouter = require('./genre.route');
const categoryRouter = require('./category.route');
const resetPasswordTokenRouter = require("./resetPasswordtoken.route")

router.use('/user', userRouter);
router.use('/code', codeRouter);
router.use('/movie', movieRouter);
router.use('/review', reviewRouter);
router.use('/genre', genreRouter);
router.use('/subscription', subscriptionRouter);
router.use('/category', categoryRouter);
router.use('/reset-password-token', resetPasswordTokenRouter);


module.exports = router;
