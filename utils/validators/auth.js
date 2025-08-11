import { prisma } from "../../src/client/index.js";
import { body } from 'express-validator'

export const validateRegister = [
    body("name").notEmpty().withMessage("name is required"),
    body('email').notEmpty().withMessage("email is required").isEmail().withMessage("email is invalid").custom(async (value) => {
        if(!value) throw new Error("email is required")
        
        // check user
        const user = await prisma.user.findUnique({where: {email: value}})

        if (user) {
            throw new Error("email already exists")
        }

        return true;
    }),
    body("password").isLength({ min: 6 }).withMessage("password must be at least 6 characters long"),
]

// define validation for login
export const validateLogin = [
    body("email").notEmpty().withMessage("email is required"),
    body("password").notEmpty().withMessage("password is required").isLength({ min: 6 })
]