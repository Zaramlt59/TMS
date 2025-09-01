import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { BlockOfficeController } from '../controllers/blockOfficeController';

const router = Router();
const blockOfficeController = new BlockOfficeController();

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

// Get all block offices (including inactive)
router.get('/', blockOfficeController.getAllBlockOffices.bind(blockOfficeController));

// Get all block offices (including inactive)
router.get('/all', blockOfficeController.getAllBlockOfficesAdmin.bind(blockOfficeController));

// Get active block offices only
router.get('/active', blockOfficeController.getActiveBlockOffices.bind(blockOfficeController));

// Get block office by ID
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Block office ID must be a positive integer')
], handleValidationErrors, blockOfficeController.getBlockOfficeById.bind(blockOfficeController));

// Create block office
router.post('/', [
  body('name').isString().trim().isLength({ min: 1 }).withMessage('Block office name is required')
], handleValidationErrors, blockOfficeController.createBlockOffice.bind(blockOfficeController));

// Update block office
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Block office ID must be a positive integer'),
  body('name').isString().trim().isLength({ min: 1 }).withMessage('Block office name is required'),
  body('is_active').optional().isBoolean()
], handleValidationErrors, blockOfficeController.updateBlockOffice.bind(blockOfficeController));

// Delete block office (soft delete)
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Block office ID must be a positive integer')
], handleValidationErrors, blockOfficeController.deleteBlockOffice.bind(blockOfficeController));

// Hard delete block office (permanent removal)
router.delete('/:id/permanent', [
  param('id').isInt({ min: 1 }).withMessage('Block office ID must be a positive integer')
], handleValidationErrors, blockOfficeController.hardDeleteBlockOffice.bind(blockOfficeController));

export default router; 