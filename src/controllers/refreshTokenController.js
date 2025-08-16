import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens/token.js';
import { prisma } from '../client/index.js';;

export const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;
    const { userId } = req;

    // if no refresh token
    if (!refreshToken) {
        res.sendStatus(401); // unauthorized
    }

    try {
        // check stored token
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token: refreshToken }
        })

        if (!storedToken) {
            return res.sendStatus(403); // forbidden
        }

        // verify the token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        // token rotation concept
        // 1- delete old refresh token from the db
        await prisma.refreshToken.delete({
            where: { id: storedToken.id }
        })

        // 2- generate new tokens
        const user = { id: decoded.id }; // assuming the decoded token contains user id
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        // 3- save refresh token in db
        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId
            }
        })

        // set new refresh token as http-only cookie
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            sameSite: 'Lax',
            secure: process.env.NODE_ENV === 'production' // use secure cookies in production
        })

        // send new access token in response
        res.status(200).json({
            success: true,
            accessToken: newAccessToken
        })

    } catch (error) {
        // if refresh token is invalid
        try {
            await prisma.refreshToken.delete({
                where: { token: refreshToken }
            })
        } catch (error) {
            console.log(error);
        }

        res.status(403).json({
            success: false,
            message: 'Invalid refresh token',
            error: error.message
        });
    }
}