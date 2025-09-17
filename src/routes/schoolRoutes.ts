import express from 'express'
import { schoolController } from '../controllers/schoolController'
import { body, param, query } from 'express-validator'
import { authenticateToken } from '../middleware/auth'
import { addRoleBasedFilters } from '../middleware/roleBasedFiltering'

const router = express.Router()

// Get all schools (with role-based filtering)
router.get('/', authenticateToken, addRoleBasedFilters, schoolController.getAll)

// Get all schools (including inactive) - with role-based filtering
router.get('/all', authenticateToken, addRoleBasedFilters, schoolController.getAll)

// Get schools by district
router.get('/district/:district', schoolController.getByDistrict)

// Get schools by RD block
router.get('/rdblock/:rdBlock', schoolController.getByRdBlock)

// Get schools by school type
router.get('/type/:schoolType', schoolController.getBySchoolType)

// Get schools by management type
router.get('/management/:management', schoolController.getByManagement)

// Get schools by medium
router.get('/medium/:medium', schoolController.getByMedium)

// Get school statistics
router.get('/stats', schoolController.getStats)

// Search schools
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required')
], schoolController.search)

// Get school by school_id (business identifier)
router.get('/school-id/:schoolId', [
  param('schoolId').notEmpty().withMessage('School ID is required')
], schoolController.getBySchoolId)

// Get school by ID
router.get('/:id', [
  param('id').notEmpty().withMessage('School ID is required')
], schoolController.getById)

// Create new school
router.post('/', [
  body('id').notEmpty().withMessage('School ID is required'),
  body('schoolName').notEmpty().withMessage('School name is required')
], schoolController.create)

// Update school by school_id (business identifier)
router.put('/school-id/:schoolId', [
  param('schoolId').notEmpty().withMessage('School ID is required')
], schoolController.updateBySchoolId)

// Update school
router.put('/:id', [
  param('id').notEmpty().withMessage('School ID is required')
], schoolController.update)

// Delete school by school_id (business identifier)
router.delete('/school-id/:schoolId', [
  param('schoolId').notEmpty().withMessage('School ID is required')
], schoolController.deleteBySchoolId)

// Soft delete school
router.delete('/:id', [
  param('id').notEmpty().withMessage('School ID is required')
], schoolController.delete)

export default router
