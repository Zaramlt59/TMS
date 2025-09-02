import { Request, Response } from 'express'
import { schoolService } from '../services/schoolService'

export const schoolController = {
  // Get all schools
  async getAll(req: Request, res: Response) {
    try {
      const schools = await schoolService.getAll()
      res.json({
        success: true,
        data: schools
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch schools',
        error: error.message
      })
    }
  },

  // Get schools by district
  async getByDistrict(req: Request, res: Response) {
    try {
      const { district } = req.query
      
      if (!district || typeof district !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'District parameter is required'
        })
      }

      const schools = await schoolService.getByDistrict(district)
      res.json({
        success: true,
        data: schools
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch schools by district',
        error: error.message
      })
    }
  },

  // Get schools by RD block
  async getByRdBlock(req: Request, res: Response) {
    try {
      const { rdBlock } = req.query
      
      if (!rdBlock || typeof rdBlock !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'RD Block parameter is required'
        })
      }

      const schools = await schoolService.getByRdBlock(rdBlock)
      res.json({
        success: true,
        data: schools
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch schools by RD block',
        error: error.message
      })
    }
  },

  // Get schools by school type
  async getBySchoolType(req: Request, res: Response) {
    try {
      const { schoolType } = req.query
      
      if (!schoolType || typeof schoolType !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'School Type parameter is required'
        })
      }

      const schools = await schoolService.getBySchoolType(schoolType)
      res.json({
        success: true,
        data: schools
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch schools by school type',
        error: error.message
      })
    }
  },

  // Get schools by management type
  async getByManagement(req: Request, res: Response) {
    try {
      const { management } = req.query
      
      if (!management || typeof management !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Management parameter is required'
        })
      }

      const schools = await schoolService.getByManagement(management)
      res.json({
        success: true,
        data: schools
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch schools by management',
        error: error.message
      })
    }
  },

  // Get schools by medium
  async getByMedium(req: Request, res: Response) {
    try {
      const { medium } = req.query
      
      if (!medium || typeof medium !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Medium parameter is required'
        })
      }

      const schools = await schoolService.getByMedium(medium)
      res.json({
        success: true,
        data: schools
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch schools by medium',
        error: error.message
      })
    }
  },

  // Get school by ID
  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid school ID'
        })
      }
      
      const school = await schoolService.getById(id)
      
      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School not found'
        })
      }

      res.json({
        success: true,
        message: 'School retrieved successfully',
        data: school
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve school',
        error: error.message
      })
    }
  },

  // Get school by school_id (business identifier)
  async getBySchoolId(req: Request, res: Response) {
    try {
      const { schoolId } = req.params
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID parameter is required'
        })
      }
      
      const school = await schoolService.getBySchoolId(schoolId)
      
      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School not found'
        })
      }

      res.json({
        success: true,
        message: 'School retrieved successfully',
        data: school
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve school',
        error: error.message
      })
    }
  },

  // Search schools
  async search(req: Request, res: Response) {
    try {
      const query = req.query.q as string
      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        })
      }

      const schools = await schoolService.search(query)
      res.json({
        success: true,
        message: 'Schools search completed successfully',
        data: schools
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to search schools',
        error: error.message
      })
    }
  },

  // Create new school
  async create(req: Request, res: Response) {
    try {
      const schoolData = req.body
      
      if (!schoolData.school_id || !schoolData.school_name) {
        return res.status(400).json({
          success: false,
          message: 'School ID and name are required'
        })
      }

      const school = await schoolService.create(schoolData)
      res.status(201).json({
        success: true,
        message: 'School created successfully',
        data: school
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create school',
        error: error.message
      })
    }
  },

  // Update school
  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid school ID'
        })
      }
      
      const schoolData = req.body

      const school = await schoolService.update(id, schoolData)
      res.json({
        success: true,
        message: 'School updated successfully',
        data: school
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update school',
        error: error.message
      })
    }
  },

  // Update school by school_id (business identifier)
  async updateBySchoolId(req: Request, res: Response) {
    try {
      const { schoolId } = req.params
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID parameter is required'
        })
      }
      
      const school = await schoolService.updateBySchoolId(schoolId, req.body)
      
      res.json({
        success: true,
        message: 'School updated successfully',
        data: school
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to update school',
        error: error.message
      })
    }
  },

  // Delete school
  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id)
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid school ID'
        })
      }
      
      const school = await schoolService.delete(id)
      res.json({
        success: true,
        message: 'School deleted successfully',
        data: school
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete school',
        error: error.message
      })
    }
  },

  // Delete school by school_id (business identifier)
  async deleteBySchoolId(req: Request, res: Response) {
    try {
      const { schoolId } = req.params
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID parameter is required'
        })
      }
      
      const school = await schoolService.deleteBySchoolId(schoolId)
      res.json({
        success: true,
        message: 'School deleted successfully',
        data: school
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete school',
        error: error.message
      })
    }
  },

  // Get school statistics
  async getStats(req: Request, res: Response) {
    try {
      const stats = await schoolService.getStats()
      res.json({
        success: true,
        message: 'School statistics retrieved successfully',
        data: stats
      })
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve school statistics',
        error: error.message
      })
    }
  }
}
