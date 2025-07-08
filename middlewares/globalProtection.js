const attackProtection = require("../utilis/attackProtection.js")
const createHttpError = require('http-errors');

const globalProtection = async (req, res, next) =>{
    const decsion = await attackProtection.protect(req);
    if(decsion.isDenied()){
        console.error("Declined request due to security concerns");
        return next(createHttpError(400, "Attack Protection"));
    }
    next();
}

module.exports = {globalProtection};