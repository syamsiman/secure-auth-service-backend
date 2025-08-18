import jwt from 'jsonwebtoken'

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '15m'
const REFRESH_TOKEN_TTL = process.env.REFRESH_TOKEN_TTL || '7d'

export const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: ACCESS_TOKEN_TTL
        })
}

export const generateRefreshToken = (user) => {
    return jwt.sign({ id: user.id, sessionId: user.sessionId || "" }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_TTL
    })
}
