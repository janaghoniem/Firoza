const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sizeQuantitySchema = new Schema({
    size: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, { _id: false });

const productSchema = new Schema({
    product_id: {
        type: String,
        required: true
    },
    collection_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String, // Assuming it's a URL or file path to the image
        required: true
    },
    sizes: [sizeQuantitySchema], // Array of size and quantity objects
    rating: {
        type: Number,
        required: false,
        default: 0
    },
    material: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    no_sales: {
        type: Number,
        required: false,
        default: 0
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
