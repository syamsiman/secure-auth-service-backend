import express from 'express';
import { register } from '../controllers/registerController.js';
import { validateRegister } from '../utils/validators/auth.js';

const router = express.Router();

router.post("/register", validateRegister, register);

export default router;