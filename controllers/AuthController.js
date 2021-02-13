const { SchemaTypes, SchemaType } = require("mongoose");
const passport = require("passport");
const bcrypt = require('bcryptjs')
const User = require("../models/user");

exports.authController={

    register(req, res){
        console.log(req.body)
        User.findOne({email: req.body.email})
            .then(async doc=>{
                if (doc){
                    res.send("User Already Exists");
                }
                if(!doc){
                    const hashPassword= await bcrypt.hash(req.body.password, 10);
                    const newUser=new User({
                        first_name:req.body.first_name,
                        last_name:req.body.last_name,
                        email:req.body.email,
                        address:{
                            city:req.body.address.city,
                            street:req.body.address.street
                        },
                        phone_num:req.body.phone_num,
                        password:hashPassword 
                    })
                    await newUser.save();
                    res.send("User created");
                }
            })
            .catch(err => {
                res.status(500).json(`Error Creating User`);
                console.log(`Error Creating user${err}`)
    })
},
    login(req, res, next){
        
        passport.authenticate("local", (err, user, info) =>{
            console.log(user)
            if (err) throw err;
            if(!user){
                res.status(403).send("No User exist");
            }
            else{
                req.login(user, err =>{
                    if(err) throw err;
                    res.send('Successfully Authenticated');
                    console.log(req.user);
                })
               
                
            }
        })(req, res, next);
            
    },

    loginGetUser(req, res){
        if (req.user)
            res.json({_id: req.user._id, first_name: req.user.first_name, last_name: req.user.last_name}); //the req.user stores the entire uern that has been authenticated inside of it.
        else
            res.json({})
    }

}