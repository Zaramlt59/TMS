import { Request, Response } from 'express';
import { BlockOfficeService } from '../services/blockOfficeService';

export class BlockOfficeController {
  private blockOfficeService: BlockOfficeService;

  constructor() {
    this.blockOfficeService = new BlockOfficeService();
  }

  // Get all block offices (including inactive)
  async getAllBlockOffices(req: Request, res: Response) {
    try {
      const result = await this.blockOfficeService.getAllBlockOffices();
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

  // Get all block offices (including inactive) - duplicate endpoint
  async getAllBlockOfficesAdmin(req: Request, res: Response) {
    try {
      const result = await this.blockOfficeService.getAllBlockOffices();
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

  // Get active block offices only
  async getActiveBlockOffices(req: Request, res: Response) {
    try {
      const result = await this.blockOfficeService.getActiveBlockOffices();
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

  // Get block office by ID
  async getBlockOfficeById(req: Request, res: Response) {
    try {
      const result = await this.blockOfficeService.getBlockOfficeById(parseInt(req.params.id));
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

  // Create block office
  async createBlockOffice(req: Request, res: Response) {
    try {
      const result = await this.blockOfficeService.createBlockOffice(req.body);
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

  // Update block office
  async updateBlockOffice(req: Request, res: Response) {
    try {
      const result = await this.blockOfficeService.updateBlockOffice(parseInt(req.params.id), req.body);
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

  // Delete block office (soft delete)
  async deleteBlockOffice(req: Request, res: Response) {
    try {
      const result = await this.blockOfficeService.deleteBlockOffice(parseInt(req.params.id));
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

  // Hard delete block office (permanent removal)
  async hardDeleteBlockOffice(req: Request, res: Response) {
    try {
      const result = await this.blockOfficeService.hardDeleteBlockOffice(parseInt(req.params.id));
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
