"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subjectController_1 = require("../controllers/subjectController");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// Get all subjects
router.get('/', subjectController_1.subjectController.getAll);
// Get subject by ID
router.get('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Subject ID must be a positive integer')
], subjectController_1.subjectController.getById);
// Get subject by code
router.get('/code', subjectController_1.subjectController.getByCode);
// Create new subject
router.post('/', [
    (0, express_validator_1.body)('name').notEmpty().trim().withMessage('Subject name is required'),
    (0, express_validator_1.body)('code').optional().isString().trim(),
    (0, express_validator_1.body)('classes').optional().isString().trim()
], subjectController_1.subjectController.create);
// Update subject
router.put('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Subject ID must be a positive integer'),
    (0, express_validator_1.body)('name').notEmpty().trim().withMessage('Subject name is required'),
    (0, express_validator_1.body)('code').optional().isString().trim(),
    (0, express_validator_1.body)('classes').optional().isString().trim()
], subjectController_1.subjectController.update);
// Delete subject
router.delete('/:id', [
    (0, express_validator_1.param)('id').isInt({ min: 1 }).withMessage('Subject ID must be a positive integer')
], subjectController_1.subjectController.delete);
exports.default = router;
//# sourceMappingURL=subjectRoutes.js.map