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
    }
}

