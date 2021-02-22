const {Router}= require('express');
const { swapDbcontroller }= require('../controllers/swap.ctrl')

const swapRouter= new Router;
swapRouter.get('/', swapDbcontroller.getSwaps);
swapRouter.get('/:id', swapDbcontroller.getSwap);
swapRouter.post('/', swapDbcontroller.addSwap);
swapRouter.put('/:id', swapDbcontroller.updateSwap);
swapRouter.delete('/:id', swapDbcontroller.deleteSwap);


exports.swapRouter= swapRouter;
