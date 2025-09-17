"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schoolController_1 = require("../controllers/schoolController");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const roleBasedFiltering_1 = require("../middleware/roleBasedFiltering");
const router = express_1.default.Router();
// Get all schools (with role-based filtering)
router.get('/', auth_1.authenticateToken, roleBasedFiltering_1.addRoleBasedFilters, schoolController_1.schoolController.getAll);
// Get all schools (including inactive) - with role-based filtering
router.get('/all', auth_1.authenticateToken, roleBasedFiltering_1.addRoleBasedFilters, schoolController_1.schoolController.getAll);
// Get schools by district
router.get('/district/:district', schoolController_1.schoolController.getByDistrict);
// Get schools by RD block
router.get('/rdblock/:rdBlock', schoolController_1.schoolController.getByRdBlock);
// Get schools by school type
router.get('/type/:schoolType', schoolController_1.schoolController.getBySchoolType);
// Get schools by management type
router.get('/management/:management', schoolController_1.schoolController.getByManagement);
// Get schools by medium
router.get('/medium/:medium', schoolController_1.schoolController.getByMedium);
// Get school statistics
router.get('/stats', schoolController_1.schoolController.getStats);
// Search schools
router.get('/search', [
    (0, express_validator_1.query)('q').notEmpty().withMessage('Search query is required')
], schoolController_1.schoolController.search);
// Get school by school_id (business identifier)
router.get('/school-id/:schoolId', [
    (0, express_validator_1.param)('schoolId').notEmpty().withMessage('School ID is required')
], schoolController_1.schoolController.getBySchoolId);
// Get school by ID
router.get('/:id', [
    (0, express_validator_1.param)('id').notEmpty().withMessage('School ID is required')
], schoolController_1.schoolController.getById);
// Create new school
router.post('/', [
    (0, express_validator_1.body)('id').notEmpty().withMessage('School ID is required'),
    (0, express_validator_1.body)('schoolName').notEmpty().withMessage('School name is required')
], schoolController_1.schoolController.create);
// Update school by school_id (business identifier)
router.put('/school-id/:schoolId', [
    (0, express_validator_1.param)('schoolId').notEmpty().withMessage('School ID is required')
], schoolController_1.schoolController.updateBySchoolId);
// Update school
router.put('/:id', [
    (0, express_validator_1.param)('id').notEmpty().withMessage('School ID is required')
], schoolController_1.schoolController.update);
// Delete school by school_id (business identifier)
router.delete('/school-id/:schoolId', [
    (0, express_validator_1.param)('schoolId').notEmpty().withMessage('School ID is required')
], schoolController_1.schoolController.deleteBySchoolId);
// Soft delete school
router.delete('/:id', [
    (0, express_validator_1.param)('id').notEmpty().withMessage('School ID is required')
], schoolController_1.schoolController.delete);
exports.default = router;
//# sourceMappingURL=schoolRoutes.js.map