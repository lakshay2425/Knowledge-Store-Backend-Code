const mongoose = require('mongoose');

// Define the UserSchema
const UserSchema = new mongoose.Schema({
    _id: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    city : {
        type: String, 
        required: true
    },
    contactNumber: {
        type: String, 
        required: true , 
        unique: true},
    address: {
        type: String
    },
    gender: { 
        type: String,
        required: true
    },
    preferences: {
        type: [String],
    },
    numberOfOrders : {
        type : Number, 
        default : 0
    },
}, {
    timestamps: true,
    collection: 'users'
});

// Compile the model
let User =  mongoose.model.User || mongoose.model("User", UserSchema);
module.exports = User;
