const {Router}= require('express');
const {userDbcontroller}= require('../controllers/user.ctrl')

const userRouter= new Router;

userRouter.get('/', userDbcontroller.getUsers);
userRouter.get('/:id', userDbcontroller.getUser);
userRouter.post('/', userDbcontroller.createUser);
userRouter.post('/:id/books', userDbcontroller.addBookToUser);
userRouter.post('/:id/wishlist', userDbcontroller.addToWishList);
userRouter.put('/:id', userDbcontroller.updateUser);


exports.UserRouter = userRouter;
