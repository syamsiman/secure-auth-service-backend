import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt'
import { prisma } from '../src/client/index.js';

// register function 
export const register = async (req, res) => {

    const { name, email, password } = req.body;

    // check validation result
    const result = validationResult(req);

    if(!result.isEmpty()) {
        // if there are errors, return error to the user
        return res.status(422).json({
            success: false,
            message: 'validation error',
            error: result.array()
        })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10,)

    // create user
    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        // return success response
        res.status(201).json({
            success: true,
            message: 'registration successful',
            data: user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'registration failed',
            error: error.message
        })
    }
}
