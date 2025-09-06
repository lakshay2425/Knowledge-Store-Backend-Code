import pkg from 'mongoose';
const {Schema, model,  models} = pkg;

// Define the AdminSchema
const AdminSchema = new Schema({
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
const Admin =  model.Admin || model("Admin", AdminSchema);

export default Admin;
