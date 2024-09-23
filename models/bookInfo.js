const mongoose = require('mongoose');


const BookSchema = new mongoose.Schema({
    author: { type: String, required: true },
    genre: { type: String , required : true},
    price: { type: Number, required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    imageLink: { type: String },
    reviews: [{
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        reviewer: { type: String }
    }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'books'
});

const bookModel = mongoose.models.Book || mongoose.model('Book', BookSchema);

module.exports = bookModel;