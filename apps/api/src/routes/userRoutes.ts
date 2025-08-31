import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();

// Rutas
router.post('/register', UserController.register);
router.get('/profile/:walletAddress', UserController.getProfile);
router.put('/profile/:walletAddress', UserController.updateProfile);
router.get('/check/:walletAddress', UserController.checkUserExists);
router.get('/', UserController.getUsers);

export { router as userRoutes };
