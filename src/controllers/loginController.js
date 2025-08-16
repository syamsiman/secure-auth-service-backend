import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { prisma } from '../client/index.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens/token.js';


// login function
export const login = async (req, res, next) => {
    const { email, password } = req.body;

    // check validation result
    const result = validationResult(req);

    // if there is error
    if (!result.isEmpty()) {
        return res.status(422).json({
            success: false,
            message: 'validation error',
            error: result.array()
        })
    }

    try {
        // check if user exists
        const user = await prisma.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
            }
        })

        if (!user || !user.password) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            })
        }

        // check password
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            })
        }

        // generate tokens
        const accessToken = generateAccessToken(user)
        const refreshToken = generateRefreshToken(user)

        // store refresh token in db
        await prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id
            }
        })

        // user without password
        delete user.password;
        const userWithoutPassword = user;

        // send refresh token as http-only cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // use secure cookies in production
            sameSite: 'Strict', // prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        // return success response
        res.status(200).json({
            success: true,
            message: 'login successful',
            data: {
                user: userWithoutPassword,
                accessToken,
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'login failed',
            error: error.message
        })
        next(error);
    }
}