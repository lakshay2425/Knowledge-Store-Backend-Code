const { config } from"../config/config");
const createHttpError from"http-errors");
const publicKey = config.get("JWT_PUBLIC_KEY");
const jwt from"jsonwebtoken");


export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      console.info('No token provided');
      return returnResponse("No Token is provided", res, 200, { userInfo: null });
    }
    const privateKeyBase64 = config.get("JWT_PRIVATE_KEY");
    const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf-8');
    const decoded = await serviceOperation(
      () => jwt.verify(token, privateKey),
      "Failed to verify and decode the token"
    );


    return returnResponse("User is LoggedIn", res, 200, { userInfo: decoded.userInfo });
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(createHttpError(401, "Token has expired, please login again"));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      console.info('Invalid token', error);
      return next(createHttpError(401, "Invalid token, please login again"));
    }

    console.info('Auth verification failed', error.message);
    return next(createHttpError(500, "Internal server error"));
  }
}

