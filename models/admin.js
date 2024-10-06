const mongoose = require('mongoose');

// Define the AdminSchema
const AdminSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    emailId: { type: String, required: true, unique: true, lowercase: true },
    contactNumber: { type: String, required: true },
    address: { type: String },
    passwordHash: { type: String, required: true },
    gender: { type: String, required: true},
    username: { type: String, required: true, unique: true, lowercase: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'admin'
});

// Compile the model
let Admin =  mongoose.model.Admin || mongoose.model("Admin", AdminSchema);
module.exports = Admin;
