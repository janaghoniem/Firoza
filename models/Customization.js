const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customaSchema = new mongoose.Schema({
    customize_id: { type: String, required: true}, // Ensure customize_id is unique if needed
    price: { type: Number, default: 0 },
    img1: { type: String, default: '' },
    img2: { type: String, default: '' },
    stone: { type: String, required: true },
    color: { type: String, required: true }
});

customaSchema.index({ stone: 1, color: 1 }, { unique: true });
const custom = mongoose.model('Customize-ring', customaSchema);
module.exports = custom;
