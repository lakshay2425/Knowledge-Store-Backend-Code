const User = require("../models/user");
const Admin = require("../models/admin")

const userId = async (emailId) =>{
    if(!emailId){
        return res.status(400).json({
            message : "emailId is required",
            success : false
        })
    }
    //console.log(emailId, "from fetchUSerId function");
    const regex = new RegExp(emailId, 'i'); // Case-insensitive regular expression
    const userDetails = await User.findOne({regex});
    //console.log(userDetails, "From fetchUserId Utilis function");
    return userDetails;
};


module.exports = userId;

