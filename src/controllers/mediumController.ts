import { Request, Response } from 'express';
import { MediumService } from '../services/mediumService';

export class MediumController {
  private mediumService: MediumService;

  constructor() {
    this.mediumService = new MediumService();
  }

  // Get all mediums (including inactive)
  async getAllMediums(req: Request, res: Response) {
    try {
      const result = await this.mediumService.getAllMediums();
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get all mediums including inactive (for admin)
  async getAllMediumsAdmin(req: Request, res: Response) {
    try {
      const result = await this.mediumService.getAllMediums();
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get active mediums only (for forms)
  async getActiveMediums(req: Request, res: Response) {
    try {
      const result = await this.mediumService.getActiveMediums();
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get medium by ID
  async getMediumById(req: Request, res: Response) {
    try {
      const result = await this.mediumService.getMediumById(parseInt(req.params.id));
      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Create medium
  async createMedium(req: Request, res: Response) {
    try {
      const result = await this.mediumService.createMedium(req.body);
      if (result.success) {
        res.status(201).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update medium
  async updateMedium(req: Request, res: Response) {
    try {
      const result = await this.mediumService.updateMedium(parseInt(req.params.id), req.body);
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Hard delete medium (permanent removal)
  async hardDeleteMedium(req: Request, res: Response) {
    try {
      const result = await this.mediumService.hardDeleteMedium(parseInt(req.params.id));
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Delete medium (soft delete)
  async deleteMedium(req: Request, res: Response) {
    try {
      const result = await this.mediumService.deleteMedium(parseInt(req.params.id));
      if (result.success) {
        res.json(result);
      } else {
        res.status(404).json(result);
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}
