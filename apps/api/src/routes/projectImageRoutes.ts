import { Router } from 'express';
import multer from 'multer';
import { ProjectImageController } from '../controllers/projectImageController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB per file

router.post('/upload', upload.array('images', 5), ProjectImageController.uploadImages);

export { router as projectImageRoutes };
