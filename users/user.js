import pkg from 'mongoose';
const {Schema, model,  models} = pkg;

// Define the UserSchema
const UserSchema = new Schema({
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

const  User =  models.User || model("User", UserSchema);
export default User;
