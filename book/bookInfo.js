import pkg from 'mongoose';
const {Schema, model,  models} = pkg;


const BookSchema = new Schema({
    author: { type: String, required: true },
    genre: { type: String , required : true},
    price: { type: Number, required: true },
    title: { type: String, required: true },
    quantity: { type: Number, required: true },
    imageLink: { type: String },
    reviews: [{
        id: { type: Number },
        date : {type: String},
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String },
        name: { type: String }
    }],
    description : { type: String },
    rating: { type: Number, min: 1, max: 5 },   
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    type : { type : String, required: true}
}, {
    timestamps: true,
    collection: 'books'
});

const bookModel = models.Book || model('Book', BookSchema);

export default bookModel;