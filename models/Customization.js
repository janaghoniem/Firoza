const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomizeSchema = new Schema({
    customize_id: { type: String, unique: true },
    price: Number,
    img1: String,
    img2: String,
    stone: { type: String, required: true },
    color: { type: String, required: true }
}, { timestamps: true });

// Create a compound index to ensure the combination of Stone and color is unique
CustomizeSchema.index({ Stone: 1, color: 1 }, { unique: true });

const custom = mongoose.model('Customize-ring', CustomizeSchema);
module.exports = custom;
