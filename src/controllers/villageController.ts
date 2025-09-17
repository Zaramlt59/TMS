import { Request, Response } from 'express'
import { villageService } from '../services/villageService'

export const villageController = {
  // Get all active villages
  async getAllActive(req: Request, res: Response) {
    try {
      const villages = await villageService.getAllActive()
      res.json({
        success: true,
        message: 'Active villages retrieved successfully',
        data: villages
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve villages',
        error: error.message
      })
    }
  },

  // Get all villages (including inactive)
  async getAll(req: Request, res: Response) {
    try {
      const villages = await villageService.getAll()
      res.json({
        success: true,
        message: 'All villages retrieved successfully',
        data: villages
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve villages',
        error: error.message
      })
    }
  },

  // Get villages by RD block
  async getByRdBlock(req: Request, res: Response) {
    try {
      const rdBlockId = parseInt(req.params.rdBlockId)
      const villages = await villageService.getByRdBlock(rdBlockId)
      res.json({
        success: true,
        message: 'Villages by RD block retrieved successfully',
        data: villages
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve villages by RD block',
        error: error.message
      })
    }
  },

  // Get villages by district
  async getByDistrict(req: Request, res: Response) {
    try {
      const districtId = parseInt(req.params.districtId)
      const villages = await villageService.getByDistrict(districtId)
      res.json({
        success: true,
        message: 'Villages by district retrieved successfully',
        data: villages
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve villages by district',
        error: error.message
      })
    }
  },

  // Get village by ID
  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const village = await villageService.getById(id)
      
      if (!village) {
        return res.status(404).json({
          success: false,
          message: 'Village not found'
        })
      }

      res.json({
        success: true,
        message: 'Village retrieved successfully',
        data: village
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve village',
        error: error.message
      })
    }
  },

  // Create new village
  async create(req: Request, res: Response) {
    try {
      const { name, rdBlockId, isActive = true } = req.body
      
      if (!name || !rdBlockId) {
        return res.status(400).json({
          success: false,
          message: 'Village name and RD block ID are required'
        })
      }

      const village = await villageService.create({ name, rdBlockId, isActive })
      res.status(201).json({
        success: true,
        message: 'Village created successfully',
        data: village
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create village',
        error: error.message
      })
    }
  },

  // Update village
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const { name, rdBlockId, isActive } = req.body
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Village name is required'
        })
      }

      const village = await villageService.update(id, { name, rdBlockId, isActive })
      res.json({
        success: true,
        message: 'Village updated successfully',
        data: village
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update village',
        error: error.message
      })
    }
  },

  // Soft delete village
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const village = await villageService.delete(id)
      res.json({
        success: true,
        message: 'Village deleted successfully',
        data: village
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete village',
        error: error.message
      })
    }
  },

  // Hard delete village
  async hardDelete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const village = await villageService.hardDelete(id)
      res.json({
        success: true,
        message: 'Village permanently deleted',
        data: village
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete village',
        error: error.message
      })
    }
  }
}
