const { Schema, model } = require('mongoose');

const userSchema= new Schema({
    first_name: { type: String, required:true },
    last_name: { type: String, required:true },
    email: {type: String, required:true},
    address:{
        city:{type:String, required:true},
        street:{type:String}
    },
    phone_num:{type:String},
    books:{type:[String]},
    wishlist:{type:[String]}

},{collation:'users'});

const User= model('User', userSchema);
module.exports=User;