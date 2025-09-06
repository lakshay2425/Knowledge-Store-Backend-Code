import pkg from 'mongoose';
const {Schema, model,  models} = pkg;

const paymentSchema = new Schema({
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
  },
  signature: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default : "INR",
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
}, { timestamps: true });

const Payment = models.Payment || model('Payment', paymentSchema);

export default Payment;