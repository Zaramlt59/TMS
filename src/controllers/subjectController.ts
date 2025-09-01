import { Request, Response } from 'express'
import { subjectService } from '../services/subjectService'

export const subjectController = {
  // Get all subjects
  async getAll(req: Request, res: Response) {
    try {
      const subjects = await subjectService.getAll()
      res.json({
        success: true,
        message: 'Subjects retrieved successfully',
        data: subjects
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve subjects',
        error: error.message
      })
    }
  },

  // Get subject by ID
  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const subject = await subjectService.getById(id)
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        })
      }

      res.json({
        success: true,
        message: 'Subject retrieved successfully',
        data: subject
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve subject',
        error: error.message
      })
    }
  },

  // Get subject by code
  async getByCode(req: Request, res: Response) {
    try {
      const { code } = req.query
      
      if (!code || typeof code !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Subject code is required'
        })
      }

      const subject = await subjectService.getByCode(code)
      
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        })
      }

      res.json({
        success: true,
        message: 'Subject retrieved successfully',
        data: subject
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve subject',
        error: error.message
      })
    }
  },

  // Create new subject
  async create(req: Request, res: Response) {
    try {
      const { name, code, classes } = req.body
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Subject name is required'
        })
      }

      const subject = await subjectService.create({ name, code, classes })
      res.status(201).json({
        success: true,
        message: 'Subject created successfully',
        data: subject
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create subject',
        error: error.message
      })
    }
  },

  // Update subject
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const { name, code, classes } = req.body
      
      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Subject name is required'
        })
      }

      const subject = await subjectService.update(id, { name, code, classes })
      res.json({
        success: true,
        message: 'Subject updated successfully',
        data: subject
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update subject',
        error: error.message
      })
    }
  },

  // Delete subject
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      const subject = await subjectService.delete(id)
      res.json({
        success: true,
        message: 'Subject deleted successfully',
        data: subject
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete subject',
        error: error.message
      })
    }
  }
}
