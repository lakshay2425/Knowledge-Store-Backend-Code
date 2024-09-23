const mongoose = require('mongoose');

// Define the UserSchema
const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    emailId: { type: String, required: true, unique: true, lowercase: true },
    contactNumber: { type: String, required: true },
    address: { type: String },
    passwordHash: { type: String, required: true },
    gender: { type: String, required: true, enum: ['male', 'female', 'other'] },
    username: { type: String, required: true, unique: true, lowercase: true },
    preferences: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'users'
});

// Compile the model
let User =  mongoose.model.User || mongoose.model("User", UserSchema);
module.exports = User;
