const User = require('../models/user');

exports.userDbcontroller = {
    getUsers(req, res) {
        User.find({})
            .then(users => res.json(users))
            .catch(err => console.log(`Could not get users ${err}`))
    },
    getUser(req, res) {
        User.findById(req.params.id)
            .then(user => res.json(user))
            .catch(err => console.log(`Could not get user ${req.params.id}`))
    },
    createUser(req, res) {
        let u = new User(req.body);
        u.save()
            .then(user => res.json(user))
            .catch(err => console.log(`Could not create user`))
    },

    addBookToUser(req, res) {
        let bookId = req.body.id;
        User.findById(req.params.id)
            .then(async user => {
                if (user) {
                    user.books.push(bookId);
                    await user.save();
                    res.json(user);
                }
                else {
                    res.status(404).send('Error finding user')
                }

            })
            .catch(err => console.log(`Could not add book to user ${req.params.id}`));
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
            .catch(err => console.log(`Could not add book to wishlist ${req.params.id}`));
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
                .catch( err => {
                    res.status(500).json(`Error updating user`);
                    console.log(`Error saving user ${err}`)
                });
            }
    },

    deleteUser(req, res){
        User.deleteOne({ id: req.params.id })
        .then(docs => { res.json(docs) })
        .catch( err => {
            res.status(500).json(`Error updating user`);
            console.log(`Error deleting user ${err}`)
        });
    },

    deleteBookToSwap(req, res){
        user_id = req.user_id;
        if (user_id != req.params.id) {
            res.status(401).send("No permission to delete book from user");
        }
        else{
            User.findById(user_id)
                .then(async user => {
                    const index= user.books.indexOf(req.params.bookId)
                    if(index> -1){
                        user.books.splice(index,1);
                        await user.save();
                        res.json(user);
                }})
                    .catch( err => {
                        res.status(500).json(`Error deleting book from user`);
                        console.log(`Error deleting book from user ${err}`)
                        

                } )
        }
        
    }





}