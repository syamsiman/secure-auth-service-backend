import { validationResult } from 'express-validator';
import LoginService from '../services/loginService.js';

// login function
export const login = async (req, res, next) => {
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
        const user = await LoginService.validateUser(req.body.email);

        // login
       const { refreshToken, accessToken, userWithoutPassword } = await LoginService.login(req, user);

       // set refresh token cookie
       res.cookie('refreshToken', refreshToken, {
           httpOnly: true,
           secure: process.env.NODE_ENV === 'production', // use secure cookies in production
           sameSite: 'Strict', // prevent CSRF attacks
           maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
       });

       // send response
       res.status(200).json({
           success: true,
           message: 'login successful',
           data: {
               user: userWithoutPassword,
               accessToken
           }
       });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'login failed',
            error: error.message
        })
        next(error);
    }
}