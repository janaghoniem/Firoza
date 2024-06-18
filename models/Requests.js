const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the 'requests' collection
const requestSchema = new Schema({
    type: { type: String, required: true },
    approvement: { type: Boolean, default: false },
    reason: { type: String }
});

// Create a model based on the schema
const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
