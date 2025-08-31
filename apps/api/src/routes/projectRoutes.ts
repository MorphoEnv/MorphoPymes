import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';

const router = Router();

// List projects for an entrepreneur
router.get('/entrepreneur/:walletAddress', ProjectController.listByEntrepreneur);

// Public listing (exclude drafts)
router.get('/public', ProjectController.listPublic);

// Categories list
router.get('/categories', ProjectController.listCategories);

// Investments by wallet (returns projects where wallet invested, with only matching investments included)
router.get('/investments', ProjectController.listInvestmentsByWallet);

// Get single project by id
router.get('/:id', ProjectController.getById);

// Invest in a project (record investor wallet and amount)
router.post('/:id/invest', ProjectController.invest);

// Create project
router.post('/', ProjectController.create);

// Update project
router.put('/:id', ProjectController.update);

export { router as projectRoutes };
