const rateLimit = require('express-rate-limit');

const createRateLimiter = (maxRequests, timeInMinutes) => {
  return rateLimit({
    windowMs: timeInMinutes * 60 * 1000, // time in minutes
    max: maxRequests, // limit each IP to maxRequests per windowMs
    standardHeaders: true, // Return rate limit info in the RateLimit-* headers
    legacyHeaders: false, // Disable the X-RateLimit-* headers
    handler: (req, res) => {
      res.status(429).json({
        error: "Too Many Requests",
        message: `You have exceeded the rate limit. Please wait ${timeInMinutes} minutes before making another request.`
      });
    }
  });
};


module.exports = {createRateLimiter};