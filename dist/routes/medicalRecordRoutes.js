"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const medicalRecordController_1 = require("../controllers/medicalRecordController");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
// All routes require auth
router.use(auth_1.authenticateToken);
// Get all medical records (admin only)
router.get('/', auth_1.requireAdmin, medicalRecordController_1.medicalRecordController.getAll);
// Get teachers without medical records (admin only)
router.get('/teachers-without-records', auth_1.requireAdmin, medicalRecordController_1.medicalRecordController.getTeachersWithoutRecords);
// Create (admin only)
router.post('/', auth_1.requireAdmin, [
    (0, express_validator_1.body)('teacherId').isInt({ min: 1 }).withMessage('teacherId is required'),
    (0, express_validator_1.body)('ailmentName').isString().notEmpty(),
    (0, express_validator_1.body)('severity').isString().isIn(['Mild', 'Moderate', 'Severe', 'Critical']).withMessage('Invalid severity'),
    (0, express_validator_1.body)('diagnosisDate').optional().isISO8601().withMessage('Invalid diagnosis date format'),
    (0, express_validator_1.body)('treatmentStatus').optional().isString().isIn(['Pending', 'Ongoing', 'Completed', 'Cancelled']).withMessage('Invalid treatment status'),
    (0, express_validator_1.body)('remarks').optional().isString(),
    (0, express_validator_1.body)('documents').optional().isString()
], medicalRecordController_1.medicalRecordController.create);
// Get by teacher
router.get('/:teacherId', [
    (0, express_validator_1.param)('teacherId').isInt({ min: 1 }).withMessage('teacherId must be a positive integer')
], medicalRecordController_1.medicalRecordController.getByTeacher);
// Update (admin only)
router.put('/:id', auth_1.requireAdmin, [
    (0, express_validator_1.param)('id').isInt({ min: 1 }),
    (0, express_validator_1.body)('ailmentName').optional().isString().notEmpty(),
    (0, express_validator_1.body)('severity').optional().isString().isIn(['Mild', 'Moderate', 'Severe', 'Critical']),
    (0, express_validator_1.body)('diagnosisDate').optional().isISO8601().withMessage('Invalid diagnosis date format'),
    (0, express_validator_1.body)('treatmentStatus').optional().isString().isIn(['Pending', 'Ongoing', 'Completed', 'Cancelled']).withMessage('Invalid treatment status'),
    (0, express_validator_1.body)('remarks').optional().isString(),
    (0, express_validator_1.body)('documents').optional().isString()
], medicalRecordController_1.medicalRecordController.update);
// Delete (admin only)
router.delete('/:id', auth_1.requireAdmin, [
    (0, express_validator_1.param)('id').isInt({ min: 1 })
], medicalRecordController_1.medicalRecordController.remove);
exports.default = router;
//# sourceMappingURL=medicalRecordRoutes.js.map