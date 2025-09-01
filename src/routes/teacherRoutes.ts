import express from 'express'
import { teacherController } from '../controllers/teacherController'
import { body, param, query } from 'express-validator'

const router = express.Router()

// Get all teachers
router.get('/', teacherController.getAll)

// Get all teachers (including inactive)
router.get('/all', teacherController.getAll)

// Get teachers by district
router.get('/district/:district', teacherController.getByDistrict)

// Get teachers by school
router.get('/school/:schoolId', teacherController.getBySchool)

// Get teachers by subject
router.get('/subject/:subject', teacherController.getBySubject)

// Search teachers
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required')
], teacherController.search)

// Get teacher statistics
router.get('/stats', teacherController.getStats)

// Get teacher by ID
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer')
], teacherController.getById)

// Create new teacher
router.post('/', [
  body('teacherName').notEmpty().trim().withMessage('Teacher name is required'),
  body('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
  body('joiningDate').optional().isISO8601().withMessage('Invalid date format'),
  body('phoneNumber').optional().isString().trim(),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('socialGroup').optional().isString().trim(),
  body('religion').optional().isString().trim(),
  body('gender').optional().isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
  body('aadhaarNumber').optional().isString().trim(),
  body('subjectsTaught').optional().isArray(),
  body('classesTaught').optional().isArray()
], teacherController.create)

// Update teacher
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer')
], teacherController.update)

// Soft delete teacher
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer')
], teacherController.delete)

export default router
