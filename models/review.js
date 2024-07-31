const mongoose = require("mongoose");

const reviewSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        minLength : 5
    },
    bookName : {
        type : String,
        required : true,
        minLength : 20
    },
    stars : {
        type : Number,
        required : true,
    },
    description : String
});

module.exports = mongoose.model("review", reviewSchema);