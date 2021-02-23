const User = require("../models/user")
const axios= require("axios").default;
exports.bookDbcontroller = {
    getAllBooks(req, res) {
        User.find({}, 'books').then(booksArrays => {
            let books = [];
            for (let book of booksArrays)
                books = books.concat(book.books)
            
            return uniqBooks = (a => [...new Set(a)])(books);
        })
        .then(booksIds => {
            return Promise.all(booksIds.map(bookId => axios.get(`https://openlibrary.org/works/${bookId}.json`)))
        })
        .then(bookRequests => {
            return bookRequests.map(r => r.data)
        })
        .then(booksData => {
            return booksData.map(book => {return {
                name: book.title,
                cover: book.covers ? book.covers[0] : null,
                id: book.key.split('/')[2],
                subject: book.subjects ? book.subjects[0] : 'General'
            }})
        })
        .then(books => res.json(books))
    },
    getBookCities(req, res) {
        const bookId = req.params.id;
        
        let filter = {} 
        if (req.user.age > 18)
            filter.age = { $gt: 18 }
        else
        {
            filter.age = { $lte: 18 }
            filter['address.city'] = req.user.address.city;
        }
        if (req.query.src == 'wishlist')
        {
            User.find({ wishlist : { $in : [bookId] }, _id: { $ne: req.user._id}, ...filter})
            .then(users => users.map(u => ({city: u.address.city, _id: u._id, first_name: u.first_name, age: u.age})))
            .then(cities => res.json(cities));
        }
        else
        {
            console.log(filter);
            User.find({ books : { $in : [bookId] }, _id: { $ne: req.user._id}, ...filter})
            .then(users => users.map(u => ({city: u.address.city, _id: u._id, first_name: u.first_name, age: u.age})))
            .then(cities => res.json(cities));
        }
    },

}

