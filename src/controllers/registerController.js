import { validationResult } from 'express-validator';
import RegisterService from '../services/registerService.js';

export const register = async (req, res, next) => {
    try {
        // check validation result
        const result = validationResult(req);

        if(!result.isEmpty()) {
            return res.status(422).json({
                success: false,
                message: 'validation error',
                error: result.array()
            })
        }
        
        const isUserExist = await RegisterService.validateUser(req.body.email);

        if (isUserExist) {
            return res.status(409).json({ //conflict
                success: false,
                message: "user already exist",
            })
        }

        const createUser = await RegisterService.createUser(req.body);

        return res.status(201).json({
            success: true,
            message: 'user created successfully',
            data: createUser
        })

    } catch (error) {
        next(error)
    }

}