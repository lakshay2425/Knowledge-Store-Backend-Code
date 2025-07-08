const jwt = require('jsonwebtoken');
const {config} = require("./config/config.js")

const authenticate = (req, res, next) => {
    try {
      // Extract token from cookies
      const token = req.cookies.token;
      
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // JWT verification options
      const verifyOptions = {
        issuer: config.get("ISSUER"),
        audience: config.get("AUDIENCE"), 
        maxAge: config.get("maxAge"), 
      };
      
      // Verify the token with options
      const decoded = jwt.verify(token, config.get("JWT_SECRET"), verifyOptions);
      // Attach user info to the request object
      req.user = decoded;
      
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.log(error, "Error happend while authenticating");
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
      } else {
        return res.status(500).json({ message: 'Authentication error' });
      }
    }
  };

module.exports.authenticate = authenticate;