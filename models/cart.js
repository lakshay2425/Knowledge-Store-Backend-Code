const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: true,
    minLength : 10
  }
});

// Check if the model is already compiled
const cartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

module.exports = cartModel;


// const mongoose = require("mongoose");

// const cartSchema = new mongoose.Schema({
//   bookName: {
//     type: String,
//     required: true,
//     minlength: 6, // Corrected from minLength to minlength
//     trim: true // Removes whitespace from both ends of the string
//   },
//   email: {
//     type: String,
//     required: true,
//     match: [/^\S+@\S+\.\S+$/, 'Invalid email address'], // Validates email format
//     trim: true // Removes whitespace from both ends of the string
//   }
// }, {
//   timestamps: true // Automatically adds createdAt and updatedAt fields
// });

// // Virtual property to get full book name with email
// cartSchema.virtual('fullCartItemInfo').get(function() {
//   return `${this.bookName} - ${this.email}`;
// });

// // Pre-save hook to format data before saving
// cartSchema.pre('save', function(next) {
//   this.isModified('bookName') && this.bookName = this.bookName.trim();
//   this.isModified('email') && this.email = this.email.trim();

//   next();
// });

// // Check if the model is already compiled
// const cartModel = mongoose.models.Cart || mongoose.model("Cart", cartSchema);

// module.exports = cartModel;
