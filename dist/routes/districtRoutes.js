"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const districtController_1 = require("../controllers/districtController");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Get all active districts
router.get('/', districtController_1.districtController.getAllActive);
// Get all districts (including inactive)
router.get('/all', districtController_1.districtController.getAll);
// Get district by ID
router.get('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('District ID must be a positive integer')
], districtController_1.districtController.getById);
// Create new district
router.post('/', [
    (0, express_validator_1.body)('name').notEmpty().trim().withMessage('District name is required'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], districtController_1.districtController.create);
// Update district
router.put('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('District ID must be a positive integer'),
    (0, express_validator_1.body)('name').notEmpty().trim().withMessage('District name is required'),
    (0, express_validator_1.body)('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
], districtController_1.districtController.update);
// Soft delete district
router.delete('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('District ID must be a positive integer')
], districtController_1.districtController.delete);
// Hard delete district
router.delete('/:id/permanent', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('District ID must be a positive integer')
], districtController_1.districtController.hardDelete);
exports.default = router;
//# sourceMappingURL=districtRoutes.js.map