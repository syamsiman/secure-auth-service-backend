import { validationResult } from 'express-validator';
import RegisterService from '../services/registerService.js';

export const register = async (req, res, next) => {
    // check validation result
    const result = validationResult(req);
    
    if(!result.isEmpty()) {
        return res.status(422).json({
            status: "fail",
            message: 'validation error',
            error: result.array()
        })
    }
    
    try {
        const isUserExist = await RegisterService.validateUser(req.body.email);

        if (isUserExist) {
            return res.status(409).json({ //conflict
                status: "fail",
                message: "user already exist",
            })
        }

        const createUser = await RegisterService.createUser(req.body);

        res.status(201).json({
            status: "success",
            message: 'user created successfully',
            data: createUser
        })

    } catch (error) {
        next(error)
    }

}