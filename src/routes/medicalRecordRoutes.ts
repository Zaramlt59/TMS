import express from 'express'
import { authenticateToken, requireAdmin } from '../middleware/auth'
import { medicalRecordController } from '../controllers/medicalRecordController'
import { body, param } from 'express-validator'

const router = express.Router()

// All routes require auth
router.use(authenticateToken)

// Get all medical records (admin only)
router.get('/', requireAdmin, medicalRecordController.getAll)

// Get teachers without medical records (admin only)
router.get('/teachers-without-records', requireAdmin, medicalRecordController.getTeachersWithoutRecords)

// Create (admin only)
router.post('/', requireAdmin, [
  body('teacherId').isInt({ min: 1 }).withMessage('teacherId is required'),
  body('ailmentName').isString().notEmpty(),
  body('severity').isString().isIn(['Mild','Moderate','Severe','Critical']).withMessage('Invalid severity'),
  body('diagnosisDate').optional().isISO8601().withMessage('Invalid diagnosis date format'),
  body('treatmentStatus').optional().isString().isIn(['Pending','Ongoing','Completed','Cancelled']).withMessage('Invalid treatment status'),
  body('remarks').optional().isString(),
  body('documents').optional().isString()
], medicalRecordController.create)

// Get by teacher
router.get('/:teacherId', [
  param('teacherId').isInt({ min: 1 }).withMessage('teacherId must be a positive integer')
], medicalRecordController.getByTeacher)

// Update (admin only)
router.put('/:id', requireAdmin, [
  param('id').isInt({ min: 1 }),
  body('ailmentName').optional().isString().notEmpty(),
  body('severity').optional().isString().isIn(['Mild','Moderate','Severe','Critical']),
  body('diagnosisDate').optional().isISO8601().withMessage('Invalid diagnosis date format'),
  body('treatmentStatus').optional().isString().isIn(['Pending','Ongoing','Completed','Cancelled']).withMessage('Invalid treatment status'),
  body('remarks').optional().isString(),
  body('documents').optional().isString()
], medicalRecordController.update)

// Delete (admin only)
router.delete('/:id', requireAdmin, [
  param('id').isInt({ min: 1 })
], medicalRecordController.remove)

export default router


