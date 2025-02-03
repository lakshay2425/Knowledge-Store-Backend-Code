const mongoose = require('mongoose');

// Define the UserSchema
const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    emailId: { type: String, required: true, unique: true, lowercase: true },
    contactNumber: { type: String, required: true , unique: true},
    address: { type: String },
    passwordHash: { type: String, required: true },
    gender: { type: String, required: true},
    username: { type: String, required: true, unique: true, lowercase: true },
    preferences: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    numberOfOrders : {type : Number, default : 0},
    city : {type: String, required: true}
}, {
    timestamps: true,
    collection: 'users'
});

// Compile the model
let User =  mongoose.model.User || mongoose.model("User", UserSchema);
module.exports = User;
