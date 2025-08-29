import { Request, Response } from 'express';
import { SchoolService } from '../services/schoolService';

export class SchoolController {
  private schoolService: SchoolService;

  constructor() {
    this.schoolService = new SchoolService();
  }

  // Create school
  async createSchool(req: Request, res: Response) {
    try {
      const result = await this.schoolService.createSchool(req.body);
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

  // Get all schools with pagination
  async getAllSchools(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await this.schoolService.getAllSchools(page, limit);
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

  // Get statistics (total schools and unique districts)
  async getStats(req: Request, res: Response) {
    try {
      const result = await this.schoolService.getStats();
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

  // Search schools
  async searchSchools(req: Request, res: Response) {
    try {
      const result = await this.schoolService.searchSchools(req.query.q as string);
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

  // Get school by ID
  async getSchoolById(req: Request, res: Response) {
    try {
      const result = await this.schoolService.getSchoolById(req.params.schoolId);
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

  // Update school
  async updateSchool(req: Request, res: Response) {
    try {
      const result = await this.schoolService.updateSchool(req.params.schoolId, req.body);
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

  // Delete school
  async deleteSchool(req: Request, res: Response) {
    try {
      const result = await this.schoolService.deleteSchool(req.params.schoolId);
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
