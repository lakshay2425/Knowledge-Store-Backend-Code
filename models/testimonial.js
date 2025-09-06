import pkg from 'mongoose';
const { Schema, model, models } = pkg;


const TestimonialSchema = new Schema({
    username: {
        type: String,
        required: true,
        minLength: 5
    },
    testimonial: {
        type: String,
        minLength: 20
    }
}, {
    timestamps: true
});


const testimonial = models.testimonial || model("testimonial", TestimonialSchema);

export default testimonial;