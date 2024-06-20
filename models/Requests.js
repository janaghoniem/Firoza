const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the 'requests' collection
const requestSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    approvement: { type: Boolean, default: null },
    reason: { type: String }
});

// Create a model based on the schema
const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
