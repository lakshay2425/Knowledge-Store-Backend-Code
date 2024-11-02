const mongoose = require("mongoose");

/**
 * Testimonial schema definition
 */
const TestimonialSchema = mongoose.Schema({
    /**
     * Username of the testimonial author
     */
    username: {
        type: String,
        required: true,
        minLength: 5
    },
    /**
     * Testimonial text
     */
    testimonial: {
        type: String,
        minLength: 20
    }
}, {
    /**
     * Enable timestamps for created and updated dates
     */
    timestamps: true
});

/**
 * Export the Testimonial model
 */
module.exports = mongoose.model.testimonial || mongoose.model("testimonial", TestimonialSchema);