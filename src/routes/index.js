import express from 'express';
import { login } from '../controllers/loginController.js';
import { register } from '../controllers/registerController.js';
import { deleteUser, findUserById, findUsers, getUsers, updateUser } from '../controllers/userController.js';
import { validateLogin, validateRegister } from '../../utils/validators/auth.js';
import { validateUserDataFind, validateUserDataUpdate } from '../../utils/validators/user.js';
import { verifyToken } from '../middlewares/auth.js';

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login)
router.get("/users", verifyToken, getUsers)
router.post("/users", verifyToken, validateUserDataFind, findUsers)
router.delete("/users/:id", verifyToken, deleteUser)
router.get("/users/:id", verifyToken, findUserById)
router.put("/users/:id", verifyToken, validateUserDataUpdate, updateUser)

export default router;