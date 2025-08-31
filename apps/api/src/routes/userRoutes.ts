import { Router } from 'express';
import { UserController } from '../controllers/userController';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Rutas
router.post('/register', UserController.register);
router.get('/profile/:walletAddress', UserController.getProfile);
router.put('/profile/:walletAddress', UserController.updateProfile);
// Upload profile image (multipart/form-data)
router.post('/profile/:walletAddress/photo', upload.single('photo'), UserController.uploadProfileImage);
router.get('/check/:walletAddress', UserController.checkUserExists);
router.get('/', UserController.getUsers);

export { router as userRoutes };
