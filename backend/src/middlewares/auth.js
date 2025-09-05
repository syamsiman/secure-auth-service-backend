import jwt from 'jsonwebtoken';
import { ErrorResponse } from '../utils/custom-response/ErrorResponse.js';

export const verifyToken = async (req, res, next) => {
    try {
            // get token
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            throw new ErrorResponse(401, 'No token provided');
        }

        // extract token
        const token = authHeader.split(" ")[1];

        try {
            // verify token 
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

            req.userId = decoded.id;
            next()
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ErrorResponse(401, 'token expired')
            } else if (error instanceof jwt.JsonWebTokenError) {
                throw new ErrorResponse(401, 'invalid token')
            }
            throw error;
        }
    } catch (error) {
        next(error)
    }
}