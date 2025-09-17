"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const religionController_1 = require("../controllers/religionController");
const router = express_1.default.Router();
const religionController = new religionController_1.ReligionController();
// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Religion ID must be a positive integer')
], handleValidationErrors, religionController.getReligionById.bind(religionController));
// Create new religion
router.post('/', [
    (0, express_validator_1.body)('name').isString().trim().isLength({ min: 1 }).withMessage('Religion name is required'),
    (0, express_validator_1.body)('is_active').optional().isBoolean().withMessage('is_active must be a boolean value')
], handleValidationErrors, religionController.createReligion.bind(religionController));
// Update religion
router.put('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Religion ID must be a positive integer'),
    (0, express_validator_1.body)('name').isString().trim().isLength({ min: 1 }).withMessage('Religion name is required'),
    (0, express_validator_1.body)('is_active').optional().isBoolean().withMessage('is_active must be a boolean value')
], handleValidationErrors, religionController.updateReligion.bind(religionController));
// Hard delete religion (permanent removal)
router.delete('/:id/permanent', religionController.hardDeleteReligion.bind(religionController));
// Force delete religion (bypasses validation)
router.delete('/:id/force', religionController.forceDeleteReligion.bind(religionController));
// Delete religion (soft delete)
router.delete('/:id', religionController.deleteReligion.bind(religionController));
exports.default = router;
//# sourceMappingURL=religionRoutes.js.map