const {Shcema, model, Mongoose, SchemaTypes}=require('mongoose');

const swapSchema= new Shcema({
    user_id1:{type: SchemaTypes.ObjectId, ref: "users"},
    user_id2:{type: SchemaTypes.ObjectId, ref: "users"},
    book_id1:{type:String},
    book_id2:{type:String}
},{collection:'swaps'});

const Swap= model('Swap', swapSchema);
module.exports=Swap;