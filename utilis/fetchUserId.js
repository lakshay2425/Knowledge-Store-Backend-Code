const User = require("../models/user");
const createHttpError = require("http-errors");

const userId = async (emailId, next) =>{
    if(!emailId){
        const err = createHttpError(400, "Email is missing");
        err.additionalFields = {success: false}
        return next(err)
    }
    const regex = new RegExp(emailId, 'i'); // Case-insensitive regular expression
    const userDetails = await User.findOne({ emailId : regex });
    return userDetails;
};


module.exports = userId;

