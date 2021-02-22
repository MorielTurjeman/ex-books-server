
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
        if (!bookId)
            res.status(400).json();
        User.findById(req.params.id)
            .then(async user => {
                if (user) {
                    if(!(user.books.includes(bookId)))
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
        if (!bookId)
            res.status(400).json();
        console.log(req.params);
        User.findById(req.params.id)
            .then(async user => {
                if (user) {
                    if (!(user.wishlist.includes(bookId))) {
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
        user_id = req.user._id;
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
        user_id = req.user._id;
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
                        
                    }
                    res.json(user);
                })
                .catch(err => {
                    res.status(500).json(`Error deleting book from user`);
                    console.log(`Error deleting book from user ${err}`)


                });
        }

    },
    deleteBookFromWishlist(req, res) {
        user_id = req.user._id;
        // cpmsp;e
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


    //add category to the functions of type "get"
    getUserBooks(req, res) {
        User.findById(req.params.id)
            .then(user => user.books)
            .then(bookIds => {
                return Promise.all(bookIds.map(bookId => axios.get(`https://openlibrary.org/works/${bookId}.json`)))
            })
            .then(responseArray => responseArray.map(res => res.data))
            .then(books => {
                return books.map(book => {
                    return {
                        name: book.title,
                        cover: book.covers ? book.covers[0] : null,
                        id: book.key.split('/')[2],
                        subject: book.subjects ? book.subjects[0] : 'General'
                    }})
            })
            .then(books => res.json(books))

    },

    getWishList(req, res){
        User.findById(req.params.id)
            .then(user => user.wishlist)
            .then(wishlist => {
                return Promise.all(wishlist.map(bookId => axios.get(`https://openlibrary.org/works/${bookId}.json`)))
            })
            .then(responseArray => responseArray.map(res => res.data))
            .then(wishlistBooks => {
                return wishlistBooks.map(book => {
                    return {
                        name: book.title,
                        cover: book.covers ? book.covers[0] : null,
                        id: book.key.split('/')[2],
                        subject: book.subjects ? book.subjects[0] : 'General'
                    }})
            })
            .then(wishlist => res.json(wishlist))

    }
}