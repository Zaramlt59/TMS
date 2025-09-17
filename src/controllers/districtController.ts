import { Request, Response } from 'express'
import { districtService } from '../services/districtService'

export const districtController = {
  // Get all active districts
  async getAllActive(req: Request, res: Response) {
    try {
      const districts = await districtService.getAllActive()
      res.json({
        success: true,
        message: 'Active districts retrieved successfully',
        data: districts
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve districts',
        error: error.message
      })
    }
  },

  // Get all districts (including inactive)
  async getAll(req: Request, res: Response) {
    try {
      const districts = await districtService.getAll()
      res.json({
        success: true,
        message: 'All districts retrieved successfully',
        data: districts
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve districts',
        error: error.message
      })
    }
  },

  // Get district by ID
  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const district = await districtService.getById(id)
      
      if (!district) {
        return res.status(404).json({
          success: false,
          message: 'District not found'
        })
      }

      res.json({
        success: true,
        message: 'District retrieved successfully',
        data: district
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve district',
        error: error.message
      })
    }
  },

  // Create new district
  async create(req: Request, res: Response) {
    try {
      const { name, is_active = true } = req.body
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'District name is required'
        })
      }

      const district = await districtService.create({ name, is_active })
      res.status(201).json({
        success: true,
        message: 'District created successfully',
        data: district
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create district',
        error: error.message
      })
    }
  },

  // Update district
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const { name, is_active } = req.body
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'District name is required'
        })
      }

      const district = await districtService.update(id, { name, is_active })
      res.json({
        success: true,
        message: 'District updated successfully',
        data: district
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update district',
        error: error.message
      })
    }
  },

  // Soft delete district
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const district = await districtService.delete(id)
      res.json({
        success: true,
        message: 'District deleted successfully',
        data: district
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete district',
        error: error.message
      })
    }
  },

  // Hard delete district
  async hardDelete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const district = await districtService.hardDelete(id)
      res.json({
        success: true,
        message: 'District permanently deleted',
        data: district
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete district',
        error: error.message
      })
    }
  }
}
