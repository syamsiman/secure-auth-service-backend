import { validationResult } from 'express-validator';
import { prisma } from '../client/index.js';
import bcrypt from 'bcrypt';

// find users
export const findUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            where: { 
                name: {
                    contains: req.query.name, // filter by name if provided
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
            orderBy: {
                id: "desc"
            }
        })

        // send success response
        res.status(200).json({
            success: true,
            message: 'users retrieved successfully',
            data: users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'failed to retrieve users',
            error: error.message
        })
    }
}

// find user by id
export const findUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            select: {
                id: true,
                name: true,
                email: true
            },
            where: { id: Number(id) }
        })

        //  if no user
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'user not found'
            })
        }

        // send success response
        res.status(200).json({
            success: true,
            message: 'user retrieved successfully',
            data: user,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'failed to retrieve user',
        })
    }
} 

// update user
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password} = req.body;


    // check validation result
    const result = validationResult(req);

    if(!result.isEmpty()){
        return res.status(400).json({
            success: false,
            message: 'validation failed',
            errors: result.array()
        })
    }

    // hash password
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined; // password is not being updated


    try {
        // update user
        const user = await prisma.user.update({
            data: {
                name,
                email: undefined, // email is not being updated
                password:  hashedPassword,
            }, where : { id: Number(id) },
        })

        // send success response
        res.status(200).json({
            success: true,
            message: 'user updated successfully',
            data: user
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'failed to update user',
            error: error.message
        })
    }
}

export const getUsers = async (req, res) => { 

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true
            }
        })

        // send success response
        res.status(200).json({
            success: true,
            message: 'users retrieved successfully',
            data: users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'failed to retrieve users',
            error: error.message
        })
    }
}

// delete user
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.user.delete({
            where: { id: Number(id) }
        })

        // send success response
        res.status(200).json({
            success: true,
            message: 'user deleted successfully'
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'failed to delete user',
            error: error.message
        })
    }
}