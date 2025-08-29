import { Request, Response } from 'express';
import { DistrictService } from '../services/districtService';

export class DistrictController {
  private districtService: DistrictService;

  constructor() {
    this.districtService = new DistrictService();
  }

  // Get all active districts
  async getActiveDistricts(req: Request, res: Response) {
    try {
      const result = await this.districtService.getActiveDistricts();
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

  // Get all districts including inactive ones
  async getAllDistrictsIncludingInactive(req: Request, res: Response) {
    try {
      const result = await this.districtService.getAllDistrictsIncludingInactive();
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

  // Get district by ID
  async getDistrictById(req: Request, res: Response) {
    try {
      const districtId = parseInt(req.params.id);
      const result = await this.districtService.getDistrictById(districtId);
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

  // Create new district
  async createDistrict(req: Request, res: Response) {
    try {
      const result = await this.districtService.createDistrict(req.body);
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

  // Update district
  async updateDistrict(req: Request, res: Response) {
    try {
      const districtId = parseInt(req.params.id);
      const result = await this.districtService.updateDistrict(districtId, req.body);
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

  // Soft delete district
  async deleteDistrict(req: Request, res: Response) {
    try {
      const districtId = parseInt(req.params.id);
      const result = await this.districtService.deleteDistrict(districtId);
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

  // Hard delete district (permanent removal)
  async hardDeleteDistrict(req: Request, res: Response) {
    try {
      const districtId = parseInt(req.params.id);
      const result = await this.districtService.hardDeleteDistrict(districtId);
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
