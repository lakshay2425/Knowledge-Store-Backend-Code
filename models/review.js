const mongoose = require("mongoose");

try{
    const reviewSchema = mongoose.Schema({
    username : {
        type : String,
        required : true,
        minLength : 5
    },
    bookName : {
        type : String,
        required : true,
        minLength : 10
    },
    stars : {
        type : Number,
        required : true,
        max : 5
    },
    description : {
        type: String,
        required : true,
        minLength:10
    }
});
    module.exports = mongoose.model.review || mongoose.model("review", reviewSchema);
} catch(err){
    res.status(500).send(`Server Error : ${err.message}`);
};
