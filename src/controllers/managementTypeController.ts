import { Request, Response } from 'express';
import { ManagementTypeService } from '../services/managementTypeService';

export class ManagementTypeController {
  private managementTypeService: ManagementTypeService;

  constructor() {
    this.managementTypeService = new ManagementTypeService();
  }

  // Get all management types (admin view - includes active and inactive)
  async getAllManagementTypes(req: Request, res: Response) {
    try {
      const result = await this.managementTypeService.getAllManagementTypes();
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

  // Get only active management types (for forms and public use)
  async getActiveManagementTypes(req: Request, res: Response) {
    try {
      const result = await this.managementTypeService.getActiveManagementTypes();
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

  // Get management type by ID
  async getManagementTypeById(req: Request, res: Response) {
    try {
      const result = await this.managementTypeService.getManagementTypeById(parseInt(req.params.id));
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

  // Create management type
  async createManagementType(req: Request, res: Response) {
    try {
      const result = await this.managementTypeService.createManagementType(req.body);
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

  // Update management type
  async updateManagementType(req: Request, res: Response) {
    try {
      const result = await this.managementTypeService.updateManagementType(parseInt(req.params.id), req.body);
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

  // Delete management type (soft delete)
  async deleteManagementType(req: Request, res: Response) {
    try {
      const result = await this.managementTypeService.deleteManagementType(parseInt(req.params.id));
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

  // Hard delete management type (permanent removal)
  async hardDeleteManagementType(req: Request, res: Response) {
    try {
      const result = await this.managementTypeService.hardDeleteManagementType(parseInt(req.params.id));
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
}
