"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const serviceCategoryController_1 = require("../controllers/serviceCategoryController");
const router = (0, express_1.Router)();
const controller = new serviceCategoryController_1.ServiceCategoryController();
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }
    next();
};
router.get('/', controller.getAll.bind(controller));
router.get('/active', controller.getActive.bind(controller));
router.get('/:id', [(0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')], handleValidationErrors, controller.getById.bind(controller));
router.post('/', [(0, express_validator_1.body)('name').isString().trim().isLength({ min: 1 }).withMessage('Name is required'), (0, express_validator_1.body)('is_active').optional().isBoolean()], handleValidationErrors, controller.create.bind(controller));
router.put('/:id', [(0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'), (0, express_validator_1.body)('name').isString().trim().isLength({ min: 1 }).withMessage('Name is required'), (0, express_validator_1.body)('is_active').optional().isBoolean()], handleValidationErrors, controller.update.bind(controller));
router.delete('/:id', [(0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')], handleValidationErrors, controller.delete.bind(controller));
router.delete('/:id/permanent', [(0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('ID must be a positive integer')], handleValidationErrors, controller.hardDelete.bind(controller));
exports.default = router;
//# sourceMappingURL=serviceCategoryRoutes.js.map