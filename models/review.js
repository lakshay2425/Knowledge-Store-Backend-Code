import pkg from 'mongoose';
const { Schema, model, models } = pkg;

const reviewSchema = Schema({
    username: {
        type: String,
        required: true,
        minLength: 5
    },
    bookName: {
        type: String,
        required: true,
        minLength: 10
    },
    stars: {
        type: Number,
        required: true,
        max: 5
    },
    description: {
        type: String,
        required: true,
        minLength: 10
    }
});
const review = models.review || model("review", reviewSchema);
export default review;