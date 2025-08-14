import { validationResult } from 'express-validator';
import { prisma } from '../client/index.js';
import bcrypt from 'bcrypt';


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
    const hashedPassword = await bcrypt.hash(password, 10)

    try {

        // check user exist
        const userExists = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (userExists) {
            return res.status(409).json({
                success: false,
                message: "user already exists"
            })
        }

        // create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
        
        // user without password
        delete user.password;
        const userWithoutPassword = user;

        // return success response
        res.status(201).json({
            success: true,
            message: 'registration successful',
            data: userWithoutPassword
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'registration failed',
            error: error.message
        })
    }
}