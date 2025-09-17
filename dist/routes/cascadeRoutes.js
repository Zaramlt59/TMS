"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_1 = require("../middleware/auth");
const cascadeController_1 = require("../controllers/cascadeController");
const router = express_1.default.Router();
// All routes require authentication and admin access
router.use(auth_1.authenticateToken);
router.use(auth_1.requireAdmin);
// Get cascade information for school deletion
router.get('/school/:schoolId', [
    (0, express_validator_1.param)('schoolId').notEmpty().withMessage('School ID is required')
], cascadeController_1.cascadeController.getSchoolCascadeInfo);
// Get cascade information for teacher deletion
router.get('/teacher/:teacherId', [
    (0, express_validator_1.param)('teacherId').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer')
], cascadeController_1.cascadeController.getTeacherCascadeInfo);
// Get cascade information for user deletion
router.get('/user/:userId', [
    (0, express_validator_1.param)('userId').isInt({ min: 1 }).withMessage('User ID must be a positive integer')
], cascadeController_1.cascadeController.getUserCascadeInfo);
// Safe delete school with cascade warning
router.delete('/school/:schoolId', [
    (0, express_validator_1.param)('schoolId').notEmpty().withMessage('School ID is required'),
    (0, express_validator_1.query)('force').optional().isBoolean().withMessage('Force parameter must be boolean')
], cascadeController_1.cascadeController.safeDeleteSchool);
// Safe delete teacher with cascade warning
router.delete('/teacher/:teacherId', [
    (0, express_validator_1.param)('teacherId').isInt({ min: 1 }).withMessage('Teacher ID must be a positive integer'),
    (0, express_validator_1.query)('force').optional().isBoolean().withMessage('Force parameter must be boolean')
], cascadeController_1.cascadeController.safeDeleteTeacher);
// Safe delete user with cascade warning
router.delete('/user/:userId', [
    (0, express_validator_1.param)('userId').isInt({ min: 1 }).withMessage('User ID must be a positive integer'),
    (0, express_validator_1.query)('force').optional().isBoolean().withMessage('Force parameter must be boolean')
], cascadeController_1.cascadeController.safeDeleteUser);
// Get cascade information for district deletion
router.get('/district/:districtId', [
    (0, express_validator_1.param)('districtId').isInt({ min: 1 }).withMessage('District ID must be a positive integer')
], cascadeController_1.cascadeController.getDistrictCascadeInfo);
// Get cascade information for RD block deletion
router.get('/rd-block/:rdBlockId', [
    (0, express_validator_1.param)('rdBlockId').isInt({ min: 1 }).withMessage('RD Block ID must be a positive integer')
], cascadeController_1.cascadeController.getRdBlockCascadeInfo);
// Get cascade information for village deletion
router.get('/village/:villageId', [
    (0, express_validator_1.param)('villageId').isInt({ min: 1 }).withMessage('Village ID must be a positive integer')
], cascadeController_1.cascadeController.getVillageCascadeInfo);
// Safe delete district with cascade warning
router.delete('/district/:districtId', [
    (0, express_validator_1.param)('districtId').isInt({ min: 1 }).withMessage('District ID must be a positive integer'),
    (0, express_validator_1.query)('force').optional().isBoolean().withMessage('Force parameter must be boolean')
], cascadeController_1.cascadeController.safeDeleteDistrict);
// Safe delete RD block with cascade warning
router.delete('/rd-block/:rdBlockId', [
    (0, express_validator_1.param)('rdBlockId').isInt({ min: 1 }).withMessage('RD Block ID must be a positive integer'),
    (0, express_validator_1.query)('force').optional().isBoolean().withMessage('Force parameter must be boolean')
], cascadeController_1.cascadeController.safeDeleteRdBlock);
// Safe delete village with cascade warning
router.delete('/village/:villageId', [
    (0, express_validator_1.param)('villageId').isInt({ min: 1 }).withMessage('Village ID must be a positive integer'),
    (0, express_validator_1.query)('force').optional().isBoolean().withMessage('Force parameter must be boolean')
], cascadeController_1.cascadeController.safeDeleteVillage);
exports.default = router;
//# sourceMappingURL=cascadeRoutes.js.map