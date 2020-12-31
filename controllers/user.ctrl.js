
const { default: axios } = require('axios');
const User = require('../models/user');

exports.userDbcontroller = {
    getUsers(req, res) {
        User.find({})
            .then(users => res.json(users))
            .catch(err => {
                res.status(500).json(`Error getting all useres`);
                console.log(`Error getting all users ${err}`)
            })
    },
    getUser(req, res) {
        User.findById(req.params.id)
            .then(user => res.json(user))
            .catch(err => {
                res.status(500).json(`Error gettint user ${req.params.id}`);
                console.log(`Error getting user ${err}`)
            })
    },
    createUser(req, res) {
        let u = new User(req.body);
        u.save()
            .then(user => res.json(user))
            .catch(err => {
                res.status(500).json(`Error creating new user`);
                console.log(`Error creating user ${err}`)
            })
    },

    addBookToUser(req, res) {
        let bookId = req.body.id;
        User.findById(req.params.id)
            .then(async user => {
                if (user) {
                    if(! (bookId in user.books))
                    {
                        user.books.push(bookId);
                        await user.save();
                    }
                    res.json(user);
                }
                else {
                    res.status(404).send('Error finding user')
                }

            })
            .catch(err => {
                res.status(500).json(`Error adding book user`);
                console.log(`Error adding book to user ${err}`)
            })
    },

    addToWishList(req, res) {
        let bookId = req.body.id;
        User.findById(req.params.id)
            .then(async user => {
                if (user) {
                    if (!(bookId in user.wishlist)) {
                        user.wishlist.push(bookId);
                        await user.save();
                        res.json(user);

                    }

                    else {
                        res.json(user);
                    }
                }
                else {
                    res.status(404).send('Error finding user')
                }
            })
            .catch(err => {
                res.status(500).json(`Error adding book to wishlist`);
                console.log(`Error adding book to wishlist ${err}`)
            });
    },
    updateUser(req, res) {
        user_id = req.user_id;
        if (user_id != req.params.id) {
            res.status(401).send("No permission to update user");
        }
        else {
            User.findById(user_id)
                .then(async user => {
                    user.first_name = req.body.first_name;
                    user.last_name = req.body.last_name;
                    user.email = req.body.email;
                    user.address = req.body.address;
                    user.phone_num = req.body.phone_num;
                    await user.save();
                    res.json(user);
                })
                .catch(err => {
                    res.status(500).json(`Error updating user`);
                    console.log(`Error saving user ${err}`)
                });
        }
    },

    deleteUser(req, res) {
        User.deleteOne({ id: req.params.id })
            .then(docs => { res.json(docs) })
            .catch(err => {
                res.status(500).json(`Error deleting user`);
                console.log(`Error deleting user ${err}`)
            });
    },

    deleteBookToSwap(req, res) {
        user_id = req.user_id;
        if (user_id != req.params.id) {
            res.status(401).send("No permission to delete book from user");
        }
        else {
            User.findById(user_id)
                .then(async user => {
                    const index = user.books.indexOf(req.params.bookId)
                    if (index > -1) {
                        user.books.splice(index, 1);
                        await user.save();
                        res.json(user);
                    }
                })
                .catch(err => {
                    res.status(500).json(`Error deleting book from user`);
                    console.log(`Error deleting book from user ${err}`)


                });
        }

    },
    deleteBookFromWishlist(req, res) {
        user_id = req.user_id;
        if (user_id != req.params.id) {
            res.status(401).send("No permission to delete book from wishlist");
        }
        else {
            User.findById(user_id)
                .then(async user => {
                    const index = user.wishlist.indexOf(req.params.bookId)
                    if (index > -1) {
                        user.wishlist.splice(index, 1);
                        await user.save();
                        res.json(user);
                    }
                })
                .catch(err => {
                    res.status(500).json(`Error deleting book from wishlist`);
                    console.log(`Error deleting book from wishlist ${err}`)


                });
        }

    },
    getUserBooks(req, res) {
        let bookIdArrayToObjdet = async function (bookId){
            if (!bookId)
                return Promise.resolve();
            let work = (await axios.get(`https://openlibrary.org/works/${bookId}.json`)).data;
            let book = {};
            if (work.covers)
            {
                book = {
                    name: work.title,
                    cover: `http://covers.openlibrary.org/b/id/${work.covers[0]}-M.jpg`,
                    id: bookId
                }
            }
            else
            {
                book = {
                    name: work.title,
                    cover: 'https://via.placeholder.com/108x107.png',
                    id: bookId

                }
            }
            
            
           return Promise.resolve(book);
        }

        User.findById(req.params.id).then(async user => {
            let bookDict= await Promise.all(user.books.map(bookIdArrayToObjdet))
            
            res.json(bookDict);

        })
    }
}