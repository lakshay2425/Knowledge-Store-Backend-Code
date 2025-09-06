import pkg from 'mongoose';
const { Schema, model, models } = pkg;

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
const SuggestedBook = models.SuggestedBook || model('SuggestedBook', SuggestedBookSchema);

export default SuggestedBook;
