import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

// Rutas de autenticación
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);
router.get('/verify', AuthController.verifyToken);
// Email verification
router.post('/send-verification', AuthController.sendVerification);
router.get('/verify-email', AuthController.verifyEmailToken);

export { router as authRoutes };
