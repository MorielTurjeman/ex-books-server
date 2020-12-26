const {Router}= require('express');
const{reviewDbcontroller}=require('../controllers/review.ctrl');
const User = require('../models/user');

const reviewRouter= new Router;

reviewRouter.get('/', reviewDbcontroller.getReviews);
reviewRouter.post('/', reviewDbcontroller.addReview);
reviewRouter.put('/:id', reviewDbcontroller.updateReview);
reviewRouter.delete('/:id', reviewDbcontroller.deleteReview);

exports.reviewRouter= reviewRouter;
