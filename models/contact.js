import pkg from 'mongoose';
const {Schema, model,  models} = pkg;


// Define the ContactSchema
const ContactSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    concern: { type: String, required: true },
    status: { type: String, enum: ['open', 'in_progress', 'resolved'], default: 'open' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'contacts'
});

// Compile the model
const Contact = model.Contact || model('Contact', ContactSchema); 

export default Contact;
