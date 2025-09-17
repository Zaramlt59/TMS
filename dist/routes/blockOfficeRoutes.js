"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const blockOfficeController_1 = require("../controllers/blockOfficeController");
const router = (0, express_1.Router)();
const blockOfficeController = new blockOfficeController_1.BlockOfficeController();
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
// Get all block offices (including inactive)
router.get('/', blockOfficeController.getAllBlockOffices.bind(blockOfficeController));
// Get all block offices (including inactive)
router.get('/all', blockOfficeController.getAllBlockOfficesAdmin.bind(blockOfficeController));
// Get active block offices only
router.get('/active', blockOfficeController.getActiveBlockOffices.bind(blockOfficeController));
// Get block office by ID
router.get('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Block office ID must be a positive integer')
], handleValidationErrors, blockOfficeController.getBlockOfficeById.bind(blockOfficeController));
// Create block office
router.post('/', [
    (0, express_validator_1.body)('name').isString().trim().isLength({ min: 1 }).withMessage('Block office name is required')
], handleValidationErrors, blockOfficeController.createBlockOffice.bind(blockOfficeController));
// Update block office
router.put('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Block office ID must be a positive integer'),
    (0, express_validator_1.body)('name').isString().trim().isLength({ min: 1 }).withMessage('Block office name is required'),
    (0, express_validator_1.body)('is_active').optional().isBoolean()
], handleValidationErrors, blockOfficeController.updateBlockOffice.bind(blockOfficeController));
// Delete block office (soft delete)
router.delete('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Block office ID must be a positive integer')
], handleValidationErrors, blockOfficeController.deleteBlockOffice.bind(blockOfficeController));
// Hard delete block office (permanent removal)
router.delete('/:id/permanent', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Block office ID must be a positive integer')
], handleValidationErrors, blockOfficeController.hardDeleteBlockOffice.bind(blockOfficeController));
exports.default = router;
//# sourceMappingURL=blockOfficeRoutes.js.map