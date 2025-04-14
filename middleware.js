const authenticate = (req, res, next) => {
    try {
      // Extract token from cookies
      const token = req.cookies.jwt;
      
      if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      // JWT verification options
      const verifyOptions = {
        issuer: process.env.ISSUER, // 'your-app-name'
        audience: process.env.AUDIENCE, // 'your-app-frontend'
        maxAge: process.env.maxAge || '2h', // Token expiration check
      };
      
      // Verify the token with options
      const decoded = jwt.verify(token, process.env.JWT_SECRET, verifyOptions);
      
      // Attach user info to the request object
      req.user = decoded;
      
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
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