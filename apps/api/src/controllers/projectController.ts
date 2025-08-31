import { Request, Response } from 'express';
import { ProjectService } from '../services/projectService';

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
}

export default ProjectController;
