"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const managementTypeController_1 = require("../controllers/managementTypeController");
const router = (0, express_1.Router)();
const managementTypeController = new managementTypeController_1.ManagementTypeController();
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
// Get all management types (admin view - includes active and inactive)
router.get('/', managementTypeController.getAllManagementTypes.bind(managementTypeController));
// Get only active management types (for forms and public use)
router.get('/active', managementTypeController.getActiveManagementTypes.bind(managementTypeController));
// Get management type by ID
router.get('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Management type ID must be a positive integer')
], handleValidationErrors, managementTypeController.getManagementTypeById.bind(managementTypeController));
// Create management type
router.post('/', [
    (0, express_validator_1.body)('name').isString().trim().isLength({ min: 1 }).withMessage('Management type name is required'),
    (0, express_validator_1.body)('is_active').optional().isBoolean().withMessage('is_active must be a boolean value')
], handleValidationErrors, managementTypeController.createManagementType.bind(managementTypeController));
// Update management type
router.put('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Management type ID must be a positive integer'),
    (0, express_validator_1.body)('name').isString().trim().isLength({ min: 1 }).withMessage('Management type name is required'),
    (0, express_validator_1.body)('is_active').optional().isBoolean().withMessage('is_active must be a boolean value')
], handleValidationErrors, managementTypeController.updateManagementType.bind(managementTypeController));
// Delete management type (soft delete)
router.delete('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Management type ID must be a positive integer')
], handleValidationErrors, managementTypeController.deleteManagementType.bind(managementTypeController));
// Hard delete management type (permanent removal)
router.delete('/:id/permanent', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Management type ID must be a positive integer')
], handleValidationErrors, managementTypeController.hardDeleteManagementType.bind(managementTypeController));
exports.default = router;
//# sourceMappingURL=managementTypeRoutes.js.map