import { Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import { DistrictController } from '../controllers/districtController';

const router = Router();
const districtController = new DistrictController();

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

// Get all districts
router.get('/', districtController.getActiveDistricts.bind(districtController));

// Get all districts including inactive ones (for admin/editing purposes)
router.get('/all', districtController.getAllDistrictsIncludingInactive.bind(districtController));

// Get district by ID
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('District ID must be a positive integer')
], districtController.getDistrictById.bind(districtController));

// Create district
router.post('/', [
  body('name').isString().trim().isLength({ min: 1 }).withMessage('District name is required')
], districtController.createDistrict.bind(districtController));

// Update district
router.put('/:id', [
  param('id').isInt({ min: 1 }).withMessage('District ID must be a positive integer'),
  body('name').isString().trim().isLength({ min: 1 }).withMessage('District name is required'),
  body('is_active').optional().isBoolean().withMessage('is_active must be a boolean value')
], handleValidationErrors, districtController.updateDistrict.bind(districtController));

// Delete district (soft delete)
router.delete('/:id', [
  param('id').isInt({ min: 1 }).withMessage('District ID must be a positive integer')
], districtController.deleteDistrict.bind(districtController));

// Hard delete district (permanent removal)
router.delete('/:id/permanent', [
  param('id').isInt({ min: 1 }).withMessage('District ID must be a positive integer')
], districtController.hardDeleteDistrict.bind(districtController));

export default router; 