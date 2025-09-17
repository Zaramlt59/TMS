import { Request, Response } from 'express'
import { reportsService } from '../services/reportsService'
import { addRoleBasedFilters } from '../middleware/roleBasedFiltering'
import * as XLSX from 'xlsx'

export const reportsController = {
  // Get role-specific dashboard statistics
  async getDashboardStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const result = await reportsService.getDashboardStats(
        req.user.role,
        req.roleFilters
      )

      if (result.success) {
        res.json(result)
      } else {
        res.status(400).json(result)
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch dashboard statistics',
        error: error.message
      })
    }
  },

  // Export data based on user role
  async exportData(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const format = (req.query.format as 'excel' | 'csv') || 'excel'
      
      const result = await reportsService.exportData(
        req.user.role,
        req.roleFilters,
        format
      )

      if (!result.success) {
        return res.status(400).json(result)
      }

      // Generate Excel file
      if (format === 'excel') {
        const workbook = XLSX.utils.book_new()
        
        if (Array.isArray(result.data)) {
          // Single sheet for array data
          const worksheet = XLSX.utils.json_to_sheet(result.data)
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Data')
        } else if (typeof result.data === 'object') {
          // Multiple sheets for object data
          Object.keys(result.data).forEach((key, index) => {
            const sheetData = Array.isArray(result.data[key]) ? result.data[key] : [result.data[key]]
            const worksheet = XLSX.utils.json_to_sheet(sheetData)
            XLSX.utils.book_append_sheet(workbook, worksheet, key)
          })
        }

        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`)
        res.send(buffer)
      } else {
        // CSV format
        let csvContent = ''
        
        if (Array.isArray(result.data)) {
          if (result.data.length > 0) {
            const headers = Object.keys(result.data[0])
            csvContent += headers.join(',') + '\n'
            result.data.forEach(row => {
              csvContent += headers.map(header => `"${row[header] || ''}"`).join(',') + '\n'
            })
          }
        } else if (typeof result.data === 'object') {
          // Handle object data for CSV
          const firstKey = Object.keys(result.data)[0]
          if (firstKey && Array.isArray(result.data[firstKey])) {
            const headers = Object.keys(result.data[firstKey][0] || {})
            csvContent += headers.join(',') + '\n'
            result.data[firstKey].forEach((row: any) => {
              csvContent += headers.map(header => `"${row[header] || ''}"`).join(',') + '\n'
            })
          }
        }

        res.setHeader('Content-Type', 'text/csv')
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`)
        res.send(csvContent)
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to export data',
        error: error.message
      })
    }
  },

  // Get teacher performance analytics
  async getTeacherAnalytics(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const { teacherId } = req.params
      
      if (!teacherId) {
        return res.status(400).json({
          success: false,
          message: 'Teacher ID is required'
        })
      }

      // Get teacher details and related data
      const teacher = await reportsService.getTeacherDetails(parseInt(teacherId))
      
      if (!teacher.success) {
        return res.status(404).json(teacher)
      }

      res.json(teacher)
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch teacher analytics',
        error: error.message
      })
    }
  },

  // Get school performance analytics
  async getSchoolAnalytics(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const { schoolId } = req.params
      
      if (!schoolId) {
        return res.status(400).json({
          success: false,
          message: 'School ID is required'
        })
      }

      // Get school details and related data
      const school = await reportsService.getSchoolDetails(schoolId)
      
      if (!school.success) {
        return res.status(404).json(school)
      }

      res.json(school)
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch school analytics',
        error: error.message
      })
    }
  },

  // Get district performance analytics
  async getDistrictAnalytics(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        })
      }

      const { district } = req.params
      
      if (!district) {
        return res.status(400).json({
          success: false,
          message: 'District name is required'
        })
      }

      // Get district details and related data
      const districtData = await reportsService.getDistrictDetails(district)
      
      if (!districtData.success) {
        return res.status(404).json(districtData)
      }

      res.json(districtData)
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to fetch district analytics',
        error: error.message
      })
    }
  }
}
