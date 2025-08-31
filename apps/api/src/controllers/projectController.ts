import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';
import { Project } from '../models/Project';

export class ProjectController {
  static async listByEntrepreneur(req: Request, res: Response) {
    try {
      const { walletAddress } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await ProjectService.getProjectsByEntrepreneur(walletAddress, page, limit);
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error listing projects:', error);
      res.status(500).json({ success: false, message: 'Error listing projects' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const data = req.body;
      const project = await ProjectService.createProject(data);
      res.status(201).json({ success: true, data: { project } });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(400).json({ success: false, message: (error as Error).message || 'Error creating project' });
    }
  }

  static async listPublic(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const category = req.query.category as string | undefined;
      const result = await ProjectService.listPublicProjects({ page, limit, category });
      res.json({ success: true, data: result });
    } catch (error) {
      console.error('Error listing public projects:', error);
      res.status(500).json({ success: false, message: 'Error listing public projects' });
    }
  }

  static async listCategories(req: Request, res: Response) {
    try {
      // Try to read enum values from the mongoose schema first and return { label, value } pairs
      const enumVals = (Project.schema.path('category') as any)?.enumValues;
      if (Array.isArray(enumVals) && enumVals.length > 0) {
        const categories = [{ label: 'All', value: '' }, ...enumVals.map((v: string) => ({ label: (v.charAt(0).toUpperCase() + v.slice(1)), value: v }))];
        return res.json({ success: true, data: { categories } });
      }

      // Fallback: distinct values present in DB
      const cats = await Project.distinct('category');
      const categories = [{ label: 'All', value: '' }, ...((cats || []) as string[]).map((v) => ({ label: (v?.charAt(0)?.toUpperCase?.() ? v.charAt(0).toUpperCase() + v.slice(1) : String(v)), value: v }))];
      return res.json({ success: true, data: { categories } });
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ success: false, message: 'Error fetching categories' });
    }
  }

  static async listInvestmentsByWallet(req: Request, res: Response) {
    try {
      const wallet = (req.query.wallet as string || '').toLowerCase();
      if (!wallet) return res.status(400).json({ success: false, message: 'wallet query parameter is required' });

      // Find projects where investments array contains this wallet
      const projects = await Project.find({ 'investments.walletAddress': wallet }).populate({ path: 'entrepreneur', select: 'firstName lastName profileImage verified bio experience walletAddress' });

      // For each project, filter investments to only include this wallet's entries
      const result = projects.map((p: any) => {
        const proj = p.toObject ? p.toObject() : p;
        proj.investments = (proj.investments || []).filter((inv: any) => (inv.walletAddress || '').toLowerCase() === wallet);
        return proj;
      });

      return res.json({ success: true, data: { projects: result } });
    } catch (error) {
      console.error('Error listing investments by wallet:', error);
      return res.status(500).json({ success: false, message: 'Error listing investments' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const project = await ProjectService.getById(id);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
      res.json({ success: true, data: { project } });
    } catch (error) {
      console.error('Error fetching project by id:', error);
      res.status(500).json({ success: false, message: 'Error fetching project' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
  const data = req.body;
  // Expect auth middleware to attach user id on req.user or req.userId
  // support both shapes
  const requesterId = (req as any).user?._id || (req as any).userId || (req as any).user?.id;
  const project = await ProjectService.updateProject(id, data, requesterId);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found or not updated' });
      res.json({ success: true, data: { project } });
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(400).json({ success: false, message: (error as Error).message || 'Error updating project' });
    }
  }

  static async invest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { walletAddress, amount } = req.body;
      if (!walletAddress || !amount) return res.status(400).json({ success: false, message: 'walletAddress and amount are required' });

      const project = await Project.findById(id);
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

      // Record investment (lowercase wallet for normalization)
      const normalizedWallet = String(walletAddress).toLowerCase();
      project.investments = project.investments || [];
      project.investments.push({ walletAddress: normalizedWallet, amount: Number(amount), createdAt: new Date() } as any);

      // Update funding aggregates
      project.funding.raised = Number(project.funding.raised || 0) + Number(amount);
      project.funding.investors = (project.funding.investors || 0) + 1;
      // percentage based on target
      project.funding.percentage = Math.min(100, Math.round((project.funding.raised / (project.funding.target || 1)) * 100));

      // Compute a simple ROI estimate for this investor based on expectedROI if numeric
      let roiPercent: number | null = null;
      const expectedROI = project.funding.expectedROI || project.funding.expectedROI === 'N/A' ? project.funding.expectedROI : null;
      if (expectedROI && typeof expectedROI === 'string') {
        const num = Number(String(expectedROI).replace('%',''));
        if (!Number.isNaN(num)) roiPercent = num;
      }

      // Persist project
      await project.save();

      // Attach the computed roiPercent to the last investment record for response (non-persistent copy)
      const lastInv = project.investments[project.investments.length - 1] as any;
      const responseInv = { walletAddress: lastInv.walletAddress, amount: lastInv.amount, roiPercent: roiPercent ?? null, createdAt: lastInv.createdAt };

      return res.json({ success: true, data: { project, investment: responseInv } });
    } catch (error) {
      console.error('Error recording investment:', error);
      return res.status(500).json({ success: false, message: 'Error recording investment' });
    }
  }
}

export default ProjectController;
