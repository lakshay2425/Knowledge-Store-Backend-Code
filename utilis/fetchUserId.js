import User from "../models/user.js";
import createHttpError from "http-errors";

const findUserById = async (userId, next) => {
    if (!userId) {
        const err = createHttpError(400, "Email is missing");
        err.additionalFields = { success: false }
        return next(err)
    }
    // const regex = new RegExp(emailId, 'i'); // Case-insensitive regular expression
    const userDetails = await User.findById(userId);
    return userDetails;
};


export default findUserById;

