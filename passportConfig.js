const User = require("./models/user");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
    passport.use(
        new localStrategy( { usernameField: 'email' }, (email, password, done) => {
            User.findOne({ email: email })
                .then(user => {
                    if (!user) return done(null, false);
                    bcrypt.compare(password, user.password, (err, result) => {
                        if (result === true) {
                            return done(null, user);
                        } else {
                            return done(null, false);
                        }
                    })



                });
        })
    );

    //sirializeUser store a cookie inside the browser (the user id)
    passport.serializeUser((user, callback) => {
        callback(null, user._id);
    })
    //resotre user from cookie stored in browser and return it
    passport.deserializeUser((id, callback) => {
        User.findById(id)
            .then(user => {
                callback(null, user)
            })
            .catch(err => callback(err, null))
    })

} 