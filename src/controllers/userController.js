import { validationResult } from 'express-validator';
import { UserService } from '../services/userService.js';

export class UserController {
    static async findUsers(req, res, next) {
        try {
            const users = await UserService.findUsers(req.query.name);
            return res.status(200).json({
                status: "success",
                message: "users retrieved successfully",
                data: users
            })
        } catch (error) {
            return res.status(500).json({
                status: "fail",
                message: 'failed to retrieved users',
                error: error.message
            })
        }
    }

    static async findUserById(req, res) {
        try {
            const user = await UserService.findById(req.params.id);

            if (!user) {
                return res.status(404).json({
                    status: "fail",
                    message: 'user not found'
                })
            }

            return res.status(200).json({
                status: "success",
                message: 'user retrieved successfully',
                data: user
            });

        } catch (error) {
            return res.status(500).json({
                status: "fail",
                message: 'failed to retrieve user',
                error: error.message
            });
        }
    }

    static async updateUser(req, res) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({
                status: "fail",
                message: 'Validation failed',
                errors: result.array()
            });
        }

        try {
            const user = await UserService.updateUser(req.params.id, req.body)

            if (!user) {
                return res.status(404).json({
                    status: "fail",
                    message: 'user not found'
                });
            }

            return res.status(200).json({
                status: "success",
                message: 'user updated successfully',
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                status: "fail",
                message: 'failed to update user',
                error: error.message
            });
        }
    }

    static async getUsers(req, res) {
        try {
            const users = await UserService.getAllUsers();
            return res.status(200).json({
                status: "success",
                message: 'users retrieved successfully',
                data: users
            });
        } catch (error) {
            return res.status(500).json({
                status: "fail",
                message: 'failed to retrieve users',
                error: error.message
            });
        }
    }

    static async deleteUser(req, res) {
        try {
            const user = await UserService.deleteUser(req.params.id);

            if (!user) {
                return res.status(404).json({
                    status: "fail",
                    message: 'user not found'
                });
            }

            return res.status(200).json({
                status: "success",
                message: 'user deleted successfully',
                data: user
            });
        } catch (error) {
            return res.status(500).json({
                status: "fail",
                message: 'failed to delete user',
                error: error.message
            });
        }
    }
}


export const {
    findUsers,
    findUserById,
    updateUser,
    getUsers,
    deleteUser
} = UserController;
