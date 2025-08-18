import TokenService from '../services/tokenService.js';
import { generateAccessToken } from '../utils/tokens/token.js';

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "No refresh token provided"
            });
        }

        // Validate and decode token
        const decoded = await TokenService.validateRefreshToken(refreshToken);
        
        // Rotate refresh token
        const newRefreshToken = await TokenService.rotateRefreshToken(
            refreshToken,
            decoded.sessionId,
            decoded.id
        );

        // Generate new access token
        const newAccessToken = generateAccessToken({ id: decoded.id });

        // Set refresh token cookie
        res.cookie('refreshToken', newRefreshToken, TokenService.setCookieOptions());

        return res.json({
            success: true,
            message: "Token refreshed successfully",
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error('Refresh Token Error:', error);
        
        if (error.message === 'Invalid refresh token') {
            return res.status(403).json({
                success: false,
                message: error.message
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong while refreshing token"
        });
    }
}