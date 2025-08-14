import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator';
import { prisma } from '../client/index.js';

// login function
export const login = async (req, res) => {
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

        // check if user exists
        if (!user) {
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

        // generate token jwt
        const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        // user without password
        delete user.password;
        const userWithoutPassword = user;

        // return success response
        res.status(200).json({
            success: true,
            message: 'login successful',
            data: {
                user: userWithoutPassword,
                token
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'login failed',
            error: error.message
        })
    }
}