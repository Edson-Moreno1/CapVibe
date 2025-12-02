import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateUserRegistration } from '../middlewares/validators.js';

const router = express.Router();

// Reactivar validación
router.post('/register', validateUserRegistration, register);
router.post('/login', login);

export default router;
