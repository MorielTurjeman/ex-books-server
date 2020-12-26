const {Schema, model, SchemaTypes}=require('mongoose');

const reviewSchema= new Schema({
    user_id:{type: SchemaTypes.ObjectId, ref: "users"},
    book_id:{type:String},
    stars:{type:Number},
    text:{type:String}

},{collection: 'reviews'});

const Review=model('Review', reviewSchema);

module.exports=Review;