const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollectionSchema = new Schema({
    Collection_Name: {
        type: String,
        required: true
    },
    collection_id: {
        type: String,
        required: true
    },
    Collection_Description: {
        type: String,
        required: true
    },
    No_of_products: {
        type: Number,
        required: true
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
        required: true
    },
    item_products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: false,
        default: []
    }]
}, { timestamps: true });

const Product = mongoose.model('Collections', productSchema);
module.exports = Product;
