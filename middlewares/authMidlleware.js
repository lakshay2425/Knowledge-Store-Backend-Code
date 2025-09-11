import { config } from "../config/config.js"
import { serviceOperation } from "../utilis/advanceFunctions.js";
import { returnResponse } from "../utilis/returnResponse.js"
import createHttpError from "http-errors";
import jwt from 'jsonwebtoken'

export const authenticateUser = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            console.info('No token provided');
            return returnResponse("You're not authenticated", res, 401, { userInfo: null });
        }
        const publicKey = config.get("JWT_PUBLIC_KEY");
        const decoded = await serviceOperation(
            () => jwt.verify(token, publicKey),
            "Failed to verify and decode the token"
        );
        req.userId = decoded.sub;
        req.gmail = decoded.userInfo.userEmail
        next();
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