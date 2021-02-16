const {Router}= require('express');
const {userDbcontroller}= require('../controllers/user.ctrl')

const userRouter= new Router;

userRouter.get('/', userDbcontroller.getUsers);
userRouter.get('/:id', userDbcontroller.getUser);
userRouter.post('/', userDbcontroller.createUser);
userRouter.post('/:id/books', userDbcontroller.addBookToUser);
userRouter.post('/:id/wishlist', userDbcontroller.addToWishList);
userRouter.put('/:id', userDbcontroller.updateUser);
userRouter.delete('/:id',userDbcontroller.deleteUser);
userRouter.get('/:id/books', userDbcontroller.getUserBooks);
userRouter.get('/:id/wishlist', userDbcontroller.getWishList);
userRouter.delete('/:id/books/:bookId', userDbcontroller.deleteBookToSwap);
userRouter.delete('/:id/wishlist/:bookId', userDbcontroller.deleteBookFromWishlist);


exports.UserRouter = userRouter;
