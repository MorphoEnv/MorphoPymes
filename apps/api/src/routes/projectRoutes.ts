import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';

const router = Router();

// List projects for an entrepreneur
router.get('/entrepreneur/:walletAddress', ProjectController.listByEntrepreneur);

// Get single project by id
router.get('/:id', ProjectController.getById);

// Create project
router.post('/', ProjectController.create);

// Update project
router.put('/:id', ProjectController.update);

export { router as projectRoutes };
