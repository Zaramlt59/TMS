import express from 'express';
import { SchoolTypeController } from '../controllers/schoolTypeController';

const router = express.Router();
const schoolTypeController = new SchoolTypeController();

// Get all school types (including inactive)
router.get('/', schoolTypeController.getAllSchoolTypes.bind(schoolTypeController));

// Get all school types including inactive (for admin)
router.get('/all', schoolTypeController.getAllSchoolTypesAdmin.bind(schoolTypeController));

// Get active school types only (for forms)
router.get('/active', schoolTypeController.getActiveSchoolTypes.bind(schoolTypeController));

// Get school type by ID
router.get('/:id', schoolTypeController.getSchoolTypeById.bind(schoolTypeController));

// Create new school type
router.post('/', schoolTypeController.createSchoolType.bind(schoolTypeController));

// Update school type
router.put('/:id', schoolTypeController.updateSchoolType.bind(schoolTypeController));

// Delete school type (soft delete)
router.delete('/:id', schoolTypeController.deleteSchoolType.bind(schoolTypeController));

// Hard delete school type (permanent)
router.delete('/:id/permanent', schoolTypeController.hardDeleteSchoolType.bind(schoolTypeController));

export default router;
