const createHttpError = require("http-errors");

const returnError = (statusCode, message, next)=>{
  const err = createHttpError(statusCode, message);
    err.additionalFields = {success: false} 
    next(err);
};


module.exports = {returnError};