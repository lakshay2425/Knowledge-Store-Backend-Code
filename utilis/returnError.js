import createHttpError from "http-errors";

export const returnError = (statusCode, message, next) => {
  const err = createHttpError(statusCode, message);
  err.additionalFields = { success: false }
  next(err);
};

