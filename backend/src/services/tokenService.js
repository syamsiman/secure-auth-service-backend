import jwt from 'jsonwebtoken';
import { prisma } from '../client/index.js';
import { generateRefreshToken } from '../utils/token.js';
import { ErrorResponse } from '../utils/custom-response/ErrorResponse.js';

export default class TokenService {
    static async rotateRefreshToken(oldToken, sessionId, userId) {
        await prisma.refreshToken.delete({
            where: { token: oldToken }
        });
        // Generate a new refresh token but with the same session ID for family detection
        const newRefreshToken = generateRefreshToken({ id: userId, sessionId });
        
        await prisma.refreshToken.create({
            data: {
                token: newRefreshToken,
                userId,
                sessionId 
            }
        });

        return newRefreshToken;
    }

    static async validateRefreshToken(token) {
        const storedToken = await prisma.refreshToken.findUnique({
            where: { token }
        });

         
        // detect replay attack
        if (!storedToken) {
            let decoded;
            try {
                decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
            } catch (error) {
                throw new ErrorResponse(403, 'invalid or expired refresh token')
            }
            // remove all family token
            await this.removeSession(decoded.userId, decoded.sessionId)
            throw new ErrorResponse(403, 'Token has been revoked or reused, Invalid refresh token');
        }
        5
        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);;
    }

    static async removeSession(userId, sessionId) {
        await prisma.refreshToken.deleteMany({
            where: { userId, sessionId }
        })
    }

    static setCookieOptions() {
        return {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };
    }
}

