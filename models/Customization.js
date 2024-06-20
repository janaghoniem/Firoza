const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomizeSchema = new Schema({
    customize_id: {
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
    Stone: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Create a compound index to ensure the combination of Stone and color is unique
CustomizeSchema.index({ Stone: 1, color: 1 }, { unique: true });

const custom = mongoose.model('CustomizationRing', CustomizeSchema);
module.exports = custom;
