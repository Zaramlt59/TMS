import express from 'express'
import { reportsController } from '../controllers/reportsController'
import { authenticateToken } from '../middleware/auth'
import { addRoleBasedFilters } from '../middleware/roleBasedFiltering'

const router = express.Router()

// All routes require authentication and role-based filtering
router.use(authenticateToken)
router.use(addRoleBasedFilters)

// Get role-specific dashboard statistics
router.get('/dashboard-stats', reportsController.getDashboardStats)

// Export data based on user role
router.get('/export', reportsController.exportData)

// Get teacher performance analytics
router.get('/teacher/:teacherId', reportsController.getTeacherAnalytics)

// Get school performance analytics
router.get('/school/:schoolId', reportsController.getSchoolAnalytics)

// Get district performance analytics
router.get('/district/:district', reportsController.getDistrictAnalytics)

export default router
