const {Schema, model, Mongoose, SchemaTypes}=require('mongoose');

const swapSchema= new Schema({
    user_id1:{type: SchemaTypes.ObjectId, ref: "User"},
    user_id2:{type: SchemaTypes.ObjectId, ref: "User"},
    book_id1:{type:String},
    book_id2:{type:String},
    swap_status:{type:String, enum:['Pending', 'Approved', 'Canceled']},
    swap_date:{ type: Date, default: Date.now },
},{collection:'swaps'});

const Swap= model('Swap', swapSchema);
module.exports=Swap;