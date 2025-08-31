import { Request, Response } from 'express';
import { MinioService } from '../services/minioService';

export class ProjectImageController {
  static async uploadImages(req: Request, res: Response) {
    try {
      const files = (req as any).files as Express.Multer.File[] | undefined;
      if (!files || files.length === 0) {
        return res.status(400).json({ success: false, message: 'No files uploaded' });
      }

      const urls: string[] = [];
      for (const file of files) {
        const ext = (file.originalname || '').split('.').pop() || 'jpg';
        const uniqueId = Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
        const objectName = `projects/${uniqueId}.${ext}`;
        const url = await MinioService.uploadBuffer(file.buffer, objectName, file.mimetype);
        urls.push(url);
      }

      res.json({ success: true, data: { urls } });
    } catch (error) {
      console.error('Error uploading project images:', error);
      res.status(500).json({ success: false, message: 'Error uploading images' });
    }
  }
}

export default ProjectImageController;
