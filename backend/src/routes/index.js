import express from 'express';
import { login } from '../controllers/loginController.js';
import { register } from '../controllers/registerController.js';
import userController from '../controllers/userController.js';
import { validateLogin, validateRegister } from '../utils/validators/auth.js';
import { validateUserDataFind, validateUserDataUpdate } from '../utils/validators/user.js';
import { verifyToken } from '../middlewares/auth.js';
import { refreshToken } from '../controllers/refreshTokenController.js';
import { logout } from '../controllers/logoutController.js';

const router = express.Router();

// auth routes
router.post("/auth/register", validateRegister, register);
router.post("/auth/login", validateLogin, login)
router.post("/auth/refresh-token", verifyToken, refreshToken)
router.post("/auth/logout", verifyToken, logout)

// user routes
router.get("/users", verifyToken, userController.getUsers)
router.post("/users", verifyToken, validateUserDataFind, userController.findUsers)
router.delete("/users/:id", verifyToken, userController.deleteUser)
router.get("/users/:id", verifyToken, userController.findUserById)
router.put("/users/:id", verifyToken, validateUserDataUpdate, userController.updateUser)

export default router;