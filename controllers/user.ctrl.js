const User= require('../models/user');

exports.userDbcontroller={
    getUser(req, res){
        User.findById(req.params.id)
            .then(user => res.json(user))
            .catch(err => console.log(`Could not get user ${req.params.id}`))
    },
    createUser(req, res){
        let u = new User(req.body);
        u.save()
            .then(user => res.json(user))
            .catch(err => console.log(`Could not create user`))
    }
}