import { Request, Response } from 'express';
import { ReligionService } from '../services/religionService';

export class ReligionController {
  private religionService: ReligionService;

  constructor() {
    this.religionService = new ReligionService();
  }

  // Get all religions (admin view - includes active and inactive)
  async getAllReligions(req: Request, res: Response) {
    try {
      const result = await this.religionService.getAllReligions();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve religions',
        error: error.message
      });
    }
  }

  // Get only active religions (for forms and public use)
  async getActiveReligions(req: Request, res: Response) {
    try {
      const result = await this.religionService.getActiveReligions();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve active religions',
        error: error.message
      });
    }
  }

  // Get religion by ID
  async getReligionById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.religionService.getReligionById(id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve religion',
        error: error.message
      });
    }
  }

  // Create new religion
  async createReligion(req: Request, res: Response) {
    try {
      const result = await this.religionService.createReligion(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create religion',
        error: error.message
      });
    }
  }

  // Update religion
  async updateReligion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.religionService.updateReligion(id, req.body);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update religion',
        error: error.message
      });
    }
  }

  // Hard delete religion (permanent removal)
  async hardDeleteReligion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.religionService.hardDeleteReligion(id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to permanently delete religion',
        error: error.message
      });
    }
  }

  // Force delete religion (bypasses validation)
  async forceDeleteReligion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.religionService.forceDeleteReligion(id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to force delete religion',
        error: error.message
      });
    }
  }

  // Delete religion (soft delete)
  async deleteReligion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const result = await this.religionService.deleteReligion(id);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete religion',
        error: error.message
      });
    }
  }
}
