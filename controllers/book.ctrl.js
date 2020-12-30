const User = require("../models/user")
const axios= require("axios").default;
exports.bookDbcontroller = {
    getAllBooks(req, res) {
        let bookIdArrayToObjdet = async function (finalDict, currArray){
            let fd = await finalDict
            
            for(let i = 0; i < currArray.books.length; i++){
                if (!(currArray.books[i] in fd))
                {
                    let work = (await axios.get(`https://openlibrary.org/works/${currArray.books[i]}.json`)).data;
                    if (work.covers)
                    {
                        fd[currArray.books[i]] = {
                            name: work.title,
                            cover: `http://covers.openlibrary.org/b/id/${work.covers[0]}-M.jpg`
                        }
                    }
                    else
                    {
                        fd[currArray.books[i]] = {
                            name: work.title,
                            cover: 'https://via.placeholder.com/108x100.png'
                        }
                    }
                }
            }
           return Promise.resolve(fd);
        }

        User.find({}, 'books').then(async booksArrays => {
            let bookDict= await booksArrays.reduce(bookIdArrayToObjdet, Promise.resolve({}));
            res.json(bookDict);
        })
    }
}

