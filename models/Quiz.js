const mongoose = require('mongoose');

const quizResultSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    answers: [{
        question: { type: String, required: true },
        category: { type: String, required: true }
    }],
    result: { type: String, required: true },
    userResponse: { type: String }, // New field for the user's response
    createdAt: { type: Date, default: Date.now }
});

const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = QuizResult;
