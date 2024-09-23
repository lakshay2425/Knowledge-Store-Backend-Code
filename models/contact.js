const mongoose = require('mongoose');
const Schema = mongoose.Schema;


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
let Contact = mongoose.model.Contact || mongoose.model('Contact', ContactSchema); 

module.exports = Contact;
