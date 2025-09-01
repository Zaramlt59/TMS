import express from 'express'
import { subjectController } from '../controllers/subjectController'
import { body, param } from 'express-validator'

const router = express.Router()

// Get all subjects
router.get('/', subjectController.getAll)

// Get subject by ID
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Subject ID must be a positive integer')
], subjectController.getById)

// Get subject by code
router.get('/code', subjectController.getByCode)

// Create new subject
router.post('/', [
  body('name').notEmpty().trim().withMessage('Subject name is required'),
  body('code').optional().isString().trim(),
  body('classes').optional().isString().trim()
], subjectController.create)

// Update subject
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Subject ID must be a positive integer'),
  body('name').notEmpty().trim().withMessage('Subject name is required'),
  body('code').optional().isString().trim(),
  body('classes').optional().isString().trim()
], subjectController.update)

// Delete subject
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Subject ID must be a positive integer')
], subjectController.delete)

export default router
