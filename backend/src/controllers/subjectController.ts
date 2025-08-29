import { Request, Response } from 'express';
import { SubjectService } from '../services/subjectService';

export class SubjectController {
  private subjectService: SubjectService;

  constructor() {
    this.subjectService = new SubjectService();
  }

  // Get all subjects
  async getAllSubjects(req: Request, res: Response) {
    try {
      const result = await this.subjectService.getAllSubjects();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve subjects',
        error: error.message
      });
    }
  }

  // Get subject by ID
  async getSubjectById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.subjectService.getSubjectById(id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve subject',
        error: error.message
      });
    }
  }

  // Create new subject
  async createSubject(req: Request, res: Response) {
    try {
      const result = await this.subjectService.createSubject(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create subject',
        error: error.message
      });
    }
  }

  // Update subject
  async updateSubject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.subjectService.updateSubject(id, req.body);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update subject',
        error: error.message
      });
    }
  }

  // Delete subject
  async deleteSubject(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.subjectService.deleteSubject(id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete subject',
        error: error.message
      });
    }
  }
}
