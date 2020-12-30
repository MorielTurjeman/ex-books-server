const User = require("../models/user")
const axios= require("axios").default;
exports.bookDbcontroller = {
    getAllBooks(req, res) {

        User.find({}, 'books').then(async booksArrays => {
            let bookDict= await booksArrays.reduce(arrayToBooksDict, Promise.resolve({}));
            res.json(bookDict);
        })
    }
}

async function arrayToBooksDict(finalDict, currArray){
    let fd = await finalDict
        
    for(let i = 0; i < currArray.books.length; i++){
        if (!(currArray.books[i] in fd))
        {
            let work = (await axios.get(`https://openlibrary.org/works/${currArray.books[i]}.json`)).data;
            let coverId= work.covers[0]
            fd[currArray.books[i]] = {cover: `http://covers.openlibrary.org/b/id/${coverId}-S.jpg`, name: work.title};
        }
    }
   return Promise.resolve(fd);
}