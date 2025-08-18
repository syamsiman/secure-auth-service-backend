import { validationResult } from 'express-validator';
import LoginService from '../services/loginService.js';

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
        const user = await LoginService.validateUser(email);

        // login
        await LoginService.login(req, user);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'login failed',
            error: error.message
        })
        next(error);
    }
}