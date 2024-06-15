const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
const Schema= mongoose.Schema;

const ordersSchema= new Schema({
user_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true


},
product_ids: [{
    type:mongoose.Schema.Types.ObjectId,
    ref:'products',
    required:true
}],
total_price : {
    type:Number,
    required:true

},
status :{
    type:String,
    enum:['pending','processing','shipped','delivered','cancelled'],
    default:'pending'
},
shipping_address :{
   
    country:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    street:{
        type:String,
        required:true
    },
    postal_code:{
        type:Number,
        required:true
    }




},
Payment_method:{
    type:String,
    enum:['credit_card','paypal','cash_on_delivery'],
    required:true
    
},
created_at:{
    type:Date,
    default:Date.now
},
updated_at:{
    type:Date,
    default:Date.now
}






},{timestamps:true});

const Order= mongoose.model('Order', ordersSchema);
module.exports=Order;

