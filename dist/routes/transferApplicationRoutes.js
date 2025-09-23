"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transferApplicationController_1 = require("../controllers/transferApplicationController");
const auth_1 = require("../middleware/auth");
const roleBasedFiltering_1 = require("../middleware/roleBasedFiltering");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Apply authentication to all routes
router.use(auth_1.authenticateToken);
// Apply role-based filtering
router.use(roleBasedFiltering_1.addRoleBasedFilters);
// Get all transfer applications (with role-based filtering)
router.get('/', [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('status').optional().isIn(['pending', 'under_review', 'approved', 'rejected']).withMessage('Invalid status'),
    (0, express_validator_1.query)('district').optional().isString().withMessage('District must be a string')
], transferApplicationController_1.transferApplicationController.getAll);
// Get transfer application by ID
router.get('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')
], transferApplicationController_1.transferApplicationController.getById);
// Create new transfer application (teachers only)
router.post('/', [
    (0, express_validator_1.body)('teacher_id').isInt({ min: 1 }).withMessage('Teacher ID is required'),
    (0, express_validator_1.body)('reason').isString().isLength({ min: 10, max: 1000 }).withMessage('Reason must be between 10 and 1000 characters'),
    (0, express_validator_1.body)('preferred_schools').isArray({ min: 1, max: 5 }).withMessage('At least 1 and at most 5 preferred schools required'),
    (0, express_validator_1.body)('preferred_schools.*.school_id').isString().withMessage('School ID is required for each preferred school'),
    (0, express_validator_1.body)('preferred_schools.*.school_name').isString().withMessage('School name is required for each preferred school'),
    (0, express_validator_1.body)('preferred_schools.*.district').isString().withMessage('District is required for each preferred school'),
    (0, express_validator_1.body)('supporting_documents').optional().isString().withMessage('Supporting documents must be a string')
], transferApplicationController_1.transferApplicationController.create);
// Update transfer application status (admin only)
router.put('/:id/status', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
    (0, express_validator_1.body)('status').isIn(['pending', 'under_review', 'approved', 'rejected']).withMessage('Invalid status'),
    (0, express_validator_1.body)('review_notes').optional().isString().isLength({ max: 1000 }).withMessage('Review notes must be less than 1000 characters'),
    (0, express_validator_1.body)('reviewed_by').optional().isString().withMessage('Reviewed by must be a string')
], transferApplicationController_1.transferApplicationController.updateStatus);
// Get transfer applications by teacher
router.get('/teacher/:teacherId', [
    (0, express_validator_1.param)('teacherId').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer')
], transferApplicationController_1.transferApplicationController.getByTeacher);
// Get statistics
router.get('/stats/overview', transferApplicationController_1.transferApplicationController.getStats);
exports.default = router;
//# sourceMappingURL=transferApplicationRoutes.js.map