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
}

export default ProjectController;
