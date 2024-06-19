const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const { v4: uuidv4 } = require('uuid');

const CollectionSchema = new Schema({
    Collection_Name: {
        type: String,
        unique: true, 
        required:true
    },
    collection_id: {
        type: Object,
        unique: true, // Ensures the collection_id is unique
        default: uuidv4
        // required: true
    },
    Collection_Description: {
        type: String,
        required: true
    },
    No_of_products: {
        type: Number,
        // required: true
    },
    No_of_sales: {
        type: Number,
        required: false,
        default: 0
    },
    img: {
        type: String, // Assuming it's a URL or file path to the image
        required: true
    },
   Date: {
        type: Date,
        // required: true
    },
    item_products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false,
        default: [0]
    }]
}, { timestamps: true });

const collection = mongoose.model('layout-collection', CollectionSchema);
module.exports = collection;
