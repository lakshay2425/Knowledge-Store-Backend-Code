const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: true,
    minlength: 6,
    trim: true // Removes whitespace from both ends of the string
  },
  email: {
    type: String,
    required: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email address'], // Validates email format
    trim: true // Removes whitespace from both ends of the string
  }
});

// Virtual property to get full book name with email
wishlistSchema.virtual('fullBookInfo').get(function() {
  return `${this.bookName} - ${this.email}`;
});

// Instance method to format the data before saving
wishlistSchema.methods.formatData = function() {
  return {
    bookName: this.bookName.toUpperCase(),
    email: this.email.toLowerCase()
  };
};

// Pre-save hook to format data before saving
wishlistSchema.pre('save', function(next) {
  this.isModified('bookName') && this.bookName.trim();
  this.isModified('email') && this.email.trim();

  next();
});


// Check if the model is already compiled
const wishlistModel = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);

module.exports = wishlistModel;

