import jwt from "jsonwebtoken";
import { prisma } from "../client/index.js";

export const logout = async (req, res, next) => {
    // verify user is authenticated
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            status: "fail",
            message: 'user already logged out'
        });
    }

    try {
         
        const decoded = jwt.verify(refreshToken, process.env.ACCESS_TOKEN_SECRET);

        console.log(decoded.id);
        // delete the refresh token from the database
        await prisma.refreshToken.deleteMany({
            where: { userId: decoded.id }
        })

        res.clearCookie('refreshToken', { 
            httpOnly: true, 
            sameSite: 'Lax', 
            secure: process.env.NODE_ENV === 'production'
         });

        // send success response
        res.status(200).json({
            status: "success",
            message: 'logout successful'
        })
    } catch (error) {
        res.clearCookie('refreshToken', { 
            httpOnly: true, 
            sameSite: 'Lax', 
            secure: process.env.NODE_ENV === 'production'
         });
        res.status(500).json({
            status: "fail",
            message: 'logout failed',
            error: error.message
        })

        next(error)
    }
}