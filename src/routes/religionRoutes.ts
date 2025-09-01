import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { ReligionController } from '../controllers/religionController';

const router = express.Router();
const religionController = new ReligionController();

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

// Get all religions (admin view - includes active and inactive)
router.get('/', religionController.getAllReligions.bind(religionController));

// Get only active religions (for forms and public use)
router.get('/active', religionController.getActiveReligions.bind(religionController));

// Get religion by ID
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Religion ID must be a positive integer')
], handleValidationErrors, religionController.getReligionById.bind(religionController));

// Create new religion
router.post('/', [
  body('name').isString().trim().isLength({ min: 1 }).withMessage('Religion name is required'),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean value')
], handleValidationErrors, religionController.createReligion.bind(religionController));

// Update religion
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Religion ID must be a positive integer'),
  body('name').isString().trim().isLength({ min: 1 }).withMessage('Religion name is required'),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean value')
], handleValidationErrors, religionController.updateReligion.bind(religionController));

// Hard delete religion (permanent removal)
router.delete('/:id/permanent', religionController.hardDeleteReligion.bind(religionController));

// Force delete religion (bypasses validation)
router.delete('/:id/force', religionController.forceDeleteReligion.bind(religionController));

// Delete religion (soft delete)
router.delete('/:id', religionController.deleteReligion.bind(religionController));

export default router;
