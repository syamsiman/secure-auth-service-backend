import jwt from 'jsonwebtoken';
import { prisma } from '../client/index.js';
import { generateRefreshToken } from '../utils/tokens/token.js';

export default class TokenService {
    static async rotateRefreshToken(oldToken, sessionId, userId) {
        await prisma.refreshToken.delete({
            where: { token: oldToken }
        });

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

        if (!storedToken) {
            throw new Error('Invalid refresh token');
        }

        return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
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