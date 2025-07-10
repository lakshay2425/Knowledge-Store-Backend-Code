const {config} = require("../config/config.js");

// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, _req, res, _next) => {
    const environment = config.get("NODE_ENV");
    const statusCode = err.statusCode || 500;
    return res.status(statusCode).json({
        message: err.message,
        errorStack: environment === "development" ? err.stack : "",
    })
}

module.exports = {globalErrorHandler};