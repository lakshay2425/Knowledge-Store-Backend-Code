const jwt = require('jsonwebtoken');
const { isUserAlreadyExist, executeQuery } = require('../utilis/databaseOperations/executeQuery');
const debuglog = require("debug")("development:isLoggedInMiddleware");

module.exports.isLoggedIn = async (req, res, next) => {
  try {
    // Check if the token exists in cookies
    if (req.cookies.token) {
      // Verify the token
      const data = jwt.verify(req.cookies.token, process.env.SECRET);

      // Check if the user exists using the decoded email
      const userExists = await isUserAlreadyExist(data.gmail);
      if (userExists) {
        // Fetch user information
        const query = "SELECT user_id, email_id, username FROM user_details WHERE email_id = ?";
        const result = await executeQuery(query, [data.gmail]);
        if (result.length > 0) {
          // Attach user information to req object
          req.user = result[0];
          // Proceed to the next middleware or route handler
          return next();
        } else {
          return res.status(404).send("User not found");
        }
      } else {
        return res.status(404).send("User not found");
      }
    } else {
      res.status(401).send("You're not authorized to access this");
    }
  } catch (error) {
    res.status(401).send("Invalid token");
  }
};
