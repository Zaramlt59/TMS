"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teacherController_1 = require("../controllers/teacherController");
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const roleBasedFiltering_1 = require("../middleware/roleBasedFiltering");
const router = express_1.default.Router();
// Get all teachers (with role-based filtering)
router.get('/', auth_1.authenticateToken, roleBasedFiltering_1.addRoleBasedFilters, teacherController_1.teacherController.getAll);
// Get all teachers (including inactive) - with role-based filtering
router.get('/all', auth_1.authenticateToken, roleBasedFiltering_1.addRoleBasedFilters, teacherController_1.teacherController.getAll);
// Get teachers by district
router.get('/district/:district', teacherController_1.teacherController.getByDistrict);
// Get teachers by school
router.get('/school/:schoolId', teacherController_1.teacherController.getBySchool);
// Get teachers by subject
router.get('/subject/:subject', teacherController_1.teacherController.getBySubject);
// Search teachers
router.get('/search', [
    (0, express_validator_1.query)('q').notEmpty().withMessage('Search query is required')
], teacherController_1.teacherController.search);
// Get teacher statistics
router.get('/stats', teacherController_1.teacherController.getStats);
// Export all teachers (with role-based filtering)
router.get('/export', auth_1.authenticateToken, roleBasedFiltering_1.addRoleBasedFilters, teacherController_1.teacherController.exportAll);
// Get teacher by ID
router.get('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer')
], teacherController_1.teacherController.getById);
// Create new teacher
router.post('/', [
    (0, express_validator_1.body)('teacherName').notEmpty().trim().withMessage('Teacher name is required'),
    (0, express_validator_1.body)('dateOfBirth').optional().isISO8601().withMessage('Invalid date format'),
    (0, express_validator_1.body)('joiningDate').optional().isISO8601().withMessage('Invalid date format'),
    (0, express_validator_1.body)('phoneNumber').optional().isString().trim(),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Invalid email format'),
    (0, express_validator_1.body)('socialGroup').optional().isString().trim(),
    (0, express_validator_1.body)('religion').optional().isString().trim(),
    (0, express_validator_1.body)('gender').optional().isIn(['Male', 'Female']).withMessage('Gender must be Male or Female'),
    (0, express_validator_1.body)('aadhaarNumber').optional().isString().trim(),
    (0, express_validator_1.body)('subjectsTaught').optional().isArray(),
    (0, express_validator_1.body)('classesTaught').optional().isArray()
], teacherController_1.teacherController.create);
// Update teacher
router.put('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer')
], teacherController_1.teacherController.update);
// Soft delete teacher
router.delete('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer')
], teacherController_1.teacherController.delete);
exports.default = router;
//# sourceMappingURL=teacherRoutes.js.map