const { Schema, model } = require('mongoose');

const userSchema= new Schema({
    first_name: { type: String, required:true },
    last_name: { type: String, required:true },
    email: {type: String, required:true},
    address:{
        city:{type:String, required:true},
        street:{type:String, required: false}
    },
    phone_num:{type:String, required: false},
    books:{type:[String], required: true, default: []},
    wishlist:{type:[String] , required: true, default: []},
    password: {type:String, required:true},
    age: { type:Number, required: true }
},{collation:'users'});

const User= model('User', userSchema);
module.exports=User;