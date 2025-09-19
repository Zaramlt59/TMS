import { Request, Response } from 'express'
import { teacherService } from '../services/teacherService'
import { addRoleBasedFilters } from '../middleware/roleBasedFiltering'
import prisma from '../services/prismaService'

export const teacherController = {
  // Get all teachers
  async getAll(req: Request, res: Response) {
    try {
      const page = parseInt((req.query.page as string) || '1')
      const limit = Math.min(parseInt((req.query.limit as string) || '20'), 100)
      
      // Pass role filters to the service
      const result = await teacherService.getAll({ 
        page, 
        limit, 
        roleFilters: req.roleFilters 
      })
      res.json(result)
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch teachers',
        error: error.message
      })
    }
  },

  // Get teachers by district
  async getByDistrict(req: Request, res: Response) {
    try {
      const { district } = req.query
      
      if (!district || typeof district !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'District parameter is required'
        })
      }

      const teachers = await teacherService.getByDistrict(district)
      res.json({
        success: true,
        data: teachers
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch teachers by district',
        error: error.message
      })
    }
  },

  // Get teachers by school
  async getBySchool(req: Request, res: Response) {
    try {
      const { schoolId } = req.query
      
      if (!schoolId || typeof schoolId !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'School ID parameter is required'
        })
      }

      const teachers = await teacherService.getBySchool(schoolId)
      res.json({
        success: true,
        data: teachers
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch teachers by school',
        error: error.message
      })
    }
  },

  // Get teachers by subject
  async getBySubject(req: Request, res: Response) {
    try {
      const subject = req.params.subject
      const teachers = await teacherService.getBySubject(subject)
      res.json({
        success: true,
        message: 'Teachers by subject retrieved successfully',
        data: teachers
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve teachers by subject',
        error: error.message
      })
    }
  },

  // Get teacher by ID
  async getById(req: Request, res: Response) {
    try {
      const idParam = req.params.id
      
      // Convert teacher_ID to database id if needed
      let id = parseInt(idParam)
      if (isNaN(id)) {
        // If idParam is a teacher_ID (string), find the corresponding database id
        const teacher = await prisma.teachers.findFirst({
          where: { teacher_ID: idParam },
          select: { id: true }
        })
        if (!teacher) {
          return res.status(404).json({
            success: false,
            message: 'Teacher not found with the provided Teacher ID'
          })
        }
        id = teacher.id
      }
      
      const teacher = await teacherService.getById(id)
      
      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Teacher not found'
        })
      }

      res.json({
        success: true,
        message: 'Teacher retrieved successfully',
        data: teacher
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve teacher',
        error: error.message
      })
    }
  },

  // Search teachers
  async search(req: Request, res: Response) {
    try {
      const query = req.query.q as string
      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        })
      }

      const teachers = await teacherService.search(query)
      res.json({
        success: true,
        message: 'Teachers search completed successfully',
        data: teachers
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to search teachers',
        error: error.message
      })
    }
  },

  // Create new teacher
  async create(req: Request, res: Response) {
    try {
      const teacherData = req.body
      
      if (!teacherData.teacher_name) {
        return res.status(400).json({
          success: false,
          message: 'Teacher name is required'
        })
      }

      // Validate teacher_ID - if provided, it must be non-empty and unique
      if (teacherData.teacher_ID !== undefined && teacherData.teacher_ID !== null) {
        if (typeof teacherData.teacher_ID === 'string' && teacherData.teacher_ID.trim() === '') {
          // Convert empty string to null to avoid unique constraint issues
          teacherData.teacher_ID = null
        } else if (teacherData.teacher_ID && typeof teacherData.teacher_ID === 'string') {
          // Check if teacher_ID already exists
          const existingTeacher = await prisma.teachers.findFirst({
            where: { teacher_ID: teacherData.teacher_ID }
          })
          
          if (existingTeacher) {
            return res.status(400).json({
              success: false,
              message: 'Teacher ID already exists. Please use a different Teacher ID.'
            })
          }
        }
      } else {
        // If teacher_ID is undefined, set it to null
        teacherData.teacher_ID = null
      }

      const teacher = await teacherService.create(teacherData)
      res.status(201).json({
        success: true,
        message: 'Teacher created successfully',
        data: teacher
      })
    } catch (error: any) {
      console.error('Teacher creation error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to create teacher',
        error: error.message
      })
    }
  },

  // Update teacher
  async update(req: Request, res: Response) {
    try {
      const idParam = req.params.id
      
      // Convert teacher_ID to database id if needed
      let id = parseInt(idParam)
      if (isNaN(id)) {
        // If idParam is a teacher_ID (string), find the corresponding database id
        const teacher = await prisma.teachers.findFirst({
          where: { teacher_ID: idParam },
          select: { id: true }
        })
        if (!teacher) {
          return res.status(404).json({
            success: false,
            message: 'Teacher not found with the provided Teacher ID'
          })
        }
        id = teacher.id
      }
      
      const teacherData = req.body

      // Validate teacher_ID - if provided, it must be non-empty and unique
      if (teacherData.teacher_ID !== undefined && teacherData.teacher_ID !== null) {
        if (typeof teacherData.teacher_ID === 'string' && teacherData.teacher_ID.trim() === '') {
          // Convert empty string to null to avoid unique constraint issues
          teacherData.teacher_ID = null
        } else if (teacherData.teacher_ID && typeof teacherData.teacher_ID === 'string') {
          // Check if teacher_ID already exists (excluding current teacher)
          const existingTeacher = await prisma.teachers.findFirst({
            where: { 
              teacher_ID: teacherData.teacher_ID,
              id: { not: id }
            }
          })
          
          if (existingTeacher) {
            return res.status(400).json({
              success: false,
              message: 'Teacher ID already exists. Please use a different Teacher ID.'
            })
          }
        }
      } else {
        // If teacher_ID is undefined, set it to null
        teacherData.teacher_ID = null
      }

      const teacher = await teacherService.update(id, teacherData)
      res.json({
        success: true,
        message: 'Teacher updated successfully',
        data: teacher
      })
    } catch (error: any) {
      console.error('Teacher update error:', error)
      res.status(500).json({
        success: false,
        message: 'Failed to update teacher',
        error: error.message
      })
    }
  },

  // Delete teacher (now uses safe deletion)
  async delete(req: Request, res: Response) {
    try {
      const idParam = req.params.id
      
      // Convert teacher_ID to database id if needed
      let id = parseInt(idParam)
      if (isNaN(id)) {
        // If idParam is a teacher_ID (string), find the corresponding database id
        const teacher = await prisma.teachers.findFirst({
          where: { teacher_ID: idParam },
          select: { id: true }
        })
        if (!teacher) {
          return res.status(404).json({
            success: false,
            message: 'Teacher not found with the provided Teacher ID'
          })
        }
        id = teacher.id
      }
      
      // Use safe deletion
      const { cascadeService } = await import('../services/cascadeService')
      const force = req.query.force === 'true'
      const result = await cascadeService.safeDeleteTeacher(id, force)
      
      if (result.success) {
        res.json({
          success: true,
          message: result.message,
          data: result.cascadeInfo
        })
      } else {
        res.status(400).json({
          success: false,
          message: result.message,
          data: result.cascadeInfo,
          error: result.error
        })
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete teacher',
        error: error.message
      })
    }
  },

  // Get teacher statistics
  async getStats(req: Request, res: Response) {
    try {
      const stats = await teacherService.getStats()
      res.json({
        success: true,
        message: 'Teacher statistics retrieved successfully',
        data: stats
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve teacher statistics',
        error: error.message
      })
    }
  }
}
