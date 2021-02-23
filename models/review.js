const {Schema, model, SchemaTypes} = require('mongoose');

const reviewSchema= new Schema({
    user_id:{type: SchemaTypes.ObjectId, ref: "User", required: true},
    book_id:{type:String, required:true},
    stars:{type:Number, required:true},
    name:{type: String, required: true},
    text:{type:String}

},{collection: 'reviews'});

const Review = model('Review', reviewSchema);

module.exports = Review;