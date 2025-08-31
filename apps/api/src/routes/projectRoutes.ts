import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';

const router = Router();

// List projects for an entrepreneur
router.get('/entrepreneur/:walletAddress', ProjectController.listByEntrepreneur);

// Create project
router.post('/', ProjectController.create);

export { router as projectRoutes };
