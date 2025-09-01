import { Request, Response } from 'express'
import { rdBlockService } from '../services/rdBlockService'
import { body, param } from 'express-validator'

export const rdBlockController = {
  // Get all active RD blocks
  async getAllActive(req: Request, res: Response) {
    try {
      const rdBlocks = await rdBlockService.getAllActive()
      res.json({
        success: true,
        message: 'Active RD blocks retrieved successfully',
        data: rdBlocks
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve RD blocks',
        error: error.message
      })
    }
  },

  // Get all RD blocks (including inactive)
  async getAll(req: Request, res: Response) {
    try {
      const rdBlocks = await rdBlockService.getAll()
      res.json({
        success: true,
        message: 'All RD blocks retrieved successfully',
        data: rdBlocks
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve RD blocks',
        error: error.message
      })
    }
  },

  // Get RD blocks by district
  async getByDistrict(req: Request, res: Response) {
    try {
      const districtId = parseInt(req.params.districtId)
      const rdBlocks = await rdBlockService.getByDistrict(districtId)
      res.json({
        success: true,
        message: 'RD blocks by district retrieved successfully',
        data: rdBlocks
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve RD blocks by district',
        error: error.message
      })
    }
  },

  // Get RD block by ID
  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const rdBlock = await rdBlockService.getById(id)
      
      if (!rdBlock) {
        return res.status(404).json({
          success: false,
          message: 'RD block not found'
        })
      }

      res.json({
        success: true,
        message: 'RD block retrieved successfully',
        data: rdBlock
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve RD block',
        error: error.message
      })
    }
  },

  // Create new RD block
  async create(req: Request, res: Response) {
    try {
      const { name, district_id, is_active = true } = req.body
      
      if (!name || !district_id) {
        return res.status(400).json({
          success: false,
          message: 'RD block name and district ID are required'
        })
      }

      const rdBlock = await rdBlockService.create({ name, district_id, is_active })
      res.status(201).json({
        success: true,
        message: 'RD block created successfully',
        data: rdBlock
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create RD block',
        error: error.message
      })
    }
  },

  // Update RD block
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const { name, district_id, is_active } = req.body
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'RD block name is required'
        })
      }

      const rdBlock = await rdBlockService.update(id, { name, district_id, is_active })
      res.json({
        success: true,
        message: 'RD block updated successfully',
        data: rdBlock
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update RD block',
        error: error.message
      })
    }
  },

  // Soft delete RD block
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const rdBlock = await rdBlockService.delete(id)
      res.json({
        success: true,
        message: 'RD block deleted successfully',
        data: rdBlock
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete RD block',
        error: error.message
      })
    }
  },

  // Hard delete RD block
  async hardDelete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const rdBlock = await rdBlockService.hardDelete(id)
      res.json({
        success: true,
        message: 'RD block permanently deleted',
        data: rdBlock
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete RD block',
        error: error.message
      })
    }
  }
}
