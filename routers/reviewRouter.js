const {Router}= require('express');
const{reviewDbcontroller}=require('../controllers/review.ctrl');


const reviewRouter= new Router;

reviewRouter.get('/', reviewDbcontroller.getReviews);
reviewRouter.get('/:id', reviewDbcontroller.getReview);
reviewRouter.post('/', reviewDbcontroller.addReview);
reviewRouter.put('/:id', reviewDbcontroller.updateReview);
reviewRouter.delete('/:id', reviewDbcontroller.deleteReview);

exports.reviewRouter= reviewRouter;
