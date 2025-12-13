import express from 'express';
import auth from '../middleware/auth.js';
import { register, login, getProfile, googleLogin } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.get('/me', auth, getProfile);

export default router;