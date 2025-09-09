import pkg from 'mongoose';
const {Schema, model,  models} = pkg;

// Define the FeedbackSchema
const FeedbackSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    feedback: { type: String, required: true, maxlength: 255 },
    rating: { type: Number, min: 1, max: 5, default: 1 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'feedbacks'
});

// Check if the model has been compiled or not
const Feedback = models.Feedback || model('Feedback', FeedbackSchema);

export default Feedback;
