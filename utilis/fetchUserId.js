const User = require("../models/user");

const userId = async (emailId) =>{
    if(!emailId){
        return res.status(400).json({
            message : "emailId is required",
            success : false
        })
    }
    const regex = new RegExp(emailId, 'i'); // Case-insensitive regular expression
    const userDetails = await User.findOne({ emailId : regex });
    return userDetails;
};


module.exports = userId;

