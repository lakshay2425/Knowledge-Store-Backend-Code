const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Assuming you have a User model defined elsewhere
const User = require('./user');

// Define the SuggestedBookSchema
const SuggestedBookSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    genre: { type: String, required: true, maxlength: 100 },
    bookName: { type: String, required: true, maxlength: 100 },
    author: { type: String, required: true, maxlength: 100 },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    suggestedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'suggested_books'
});

// Check if the model has been compiled or not
let SuggestedBook = mongoose.models.SuggestedBook || mongoose.model('SuggestedBook', SuggestedBookSchema);

module.exports = SuggestedBook;
