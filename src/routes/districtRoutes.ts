import express from 'express'
import { districtController } from '../controllers/districtController'
import { body, param } from 'express-validator'

const router = express.Router()

// Get all active districts
router.get('/', districtController.getAllActive)

// Get all districts (including inactive)
router.get('/all', districtController.getAll)

// Get district by ID
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('District ID must be a positive integer')
], districtController.getById)

// Create new district
router.post('/', [
  body('name').notEmpty().trim().withMessage('District name is required'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], districtController.create)

// Update district
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('District ID must be a positive integer'),
  body('name').notEmpty().trim().withMessage('District name is required'),
  body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], districtController.update)

// Soft delete district
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('District ID must be a positive integer')
], districtController.delete)

// Hard delete district
router.delete('/:id/permanent', [
  param('id').isInt({ min: 1 }).withMessage('District ID must be a positive integer')
], districtController.hardDelete)

export default router 