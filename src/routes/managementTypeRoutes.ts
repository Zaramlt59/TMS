import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { ManagementTypeController } from '../controllers/managementTypeController';

const router = Router();
const managementTypeController = new ManagementTypeController();

// Validation error handler middleware
const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Get all management types (admin view - includes active and inactive)
router.get('/', managementTypeController.getAllManagementTypes.bind(managementTypeController));

// Get only active management types (for forms and public use)
router.get('/active', managementTypeController.getActiveManagementTypes.bind(managementTypeController));

// Get management type by ID
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Management type ID must be a positive integer')
], handleValidationErrors, managementTypeController.getManagementTypeById.bind(managementTypeController));

// Create management type
router.post('/', [
  body('name').isString().trim().isLength({ min: 1 }).withMessage('Management type name is required'),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean value')
], handleValidationErrors, managementTypeController.createManagementType.bind(managementTypeController));

// Update management type
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Management type ID must be a positive integer'),
  body('name').isString().trim().isLength({ min: 1 }).withMessage('Management type name is required'),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean value')
], handleValidationErrors, managementTypeController.updateManagementType.bind(managementTypeController));

// Delete management type (soft delete)
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Management type ID must be a positive integer')
], handleValidationErrors, managementTypeController.deleteManagementType.bind(managementTypeController));

// Hard delete management type (permanent removal)
router.delete('/:id/permanent', [
  param('id').isInt({ min: 1 }).withMessage('Management type ID must be a positive integer')
], handleValidationErrors, managementTypeController.hardDeleteManagementType.bind(managementTypeController));

export default router; 