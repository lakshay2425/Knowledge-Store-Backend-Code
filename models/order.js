import pkg from 'mongoose';
const {Schema, model,  models} = pkg;

// Define the OrderSchema
const OrderSchema = new Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    bookName : {type : String, required : true},
    genre: { type: String },
    securityDeposit : {type : Number, required : true},
    rentCharges : {type : Number, required : true},
    days : {type : Number, required : true},
    paymentMethod : {type : String, default: "Cash"},
    status : {type : String , default : "ordered"},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'orders'
});

// Compile the model
let Order =  model.Order || model("Order", OrderSchema);
export default Order;
