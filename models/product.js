const { Timestamp } = require('mongodb');
const mongoose = require('mongoose');
constSchema=mongoose.Schema;
const productSchema=new Schema({
    ID:{
        type: String,
        required: true,
    }
},{Timestamp: true});

const producty=mongoose.model('product',constSchema);
module.exports=producty;