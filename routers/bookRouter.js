const {Router}= require(`express`);
const {bookDbcontroller}= require('../controllers/book.ctrl');

const bookRouter= new Router;

bookRouter.get('/', bookDbcontroller.getAllBooks);
bookRouter.get("/:id", bookDbcontroller.getBookCities);

exports.bookRouter=bookRouter;

